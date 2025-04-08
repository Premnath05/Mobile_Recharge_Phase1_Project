package com.spectrum1web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spectrum1web.model.User;
import com.spectrum1web.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TwilioService twilioService;

    private static final int OTP_EXPIRY_MINUTES = 5;

    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public String generateAndSendOTP(String mobileNo) {
        validateMobileNumber(mobileNo);
        String strippedMobileNo = stripCountryCode(mobileNo).trim();
        System.out.println("Searching for user with mobile number: " + strippedMobileNo);

        Optional<User> userOptional = userRepository.findByMobileNo(strippedMobileNo);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user.getMobileNo());
            String otp = generateOTP();
            user.setOtp(otp);
            user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
            userRepository.save(user);

            String formattedMobileNo = formatMobileNumberForTwilio(mobileNo);
            System.out.println("Sending OTP to formatted number: " + formattedMobileNo);
            try {
                twilioService.sendSMS(formattedMobileNo, "Your OTP for SpectrumLink login is: " + otp);
                System.out.println("OTP sent successfully to " + formattedMobileNo);
                return "OTP sent successfully!";
            } catch (RuntimeException e) {
                System.err.println("Failed to send OTP via Twilio: " + e.getMessage());
                throw new RuntimeException("Failed to send OTP: " + e.getMessage());
            }
        } else {
            System.out.println("User not found for mobile number: " + strippedMobileNo);
            throw new RuntimeException("User with mobile number " + strippedMobileNo + " not found!");
        }
    }

    public void saveOTP(String mobileNo, String otp) {
        validateMobileNumber(mobileNo);
        String strippedMobileNo = stripCountryCode(mobileNo).trim();
        System.out.println("Searching for user with mobile number: " + strippedMobileNo);

        Optional<User> userOptional = userRepository.findByMobileNo(strippedMobileNo);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("User found: " + user.getMobileNo());
            user.setOtp(otp);
            user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
            userRepository.save(user);

            String formattedMobileNo = formatMobileNumberForTwilio(mobileNo);
            System.out.println("Sending OTP to formatted number: " + formattedMobileNo);
            try {
                twilioService.sendSMS(formattedMobileNo, "Your OTP for SpectrumLink login is: " + otp);
                System.out.println("OTP sent successfully to " + formattedMobileNo);
            } catch (RuntimeException e) {
                System.err.println("Failed to send OTP via Twilio: " + e.getMessage());
                throw new RuntimeException("Failed to send OTP: " + e.getMessage());
            }
        } else {
            System.out.println("User not found for mobile number: " + strippedMobileNo);
            throw new RuntimeException("User with mobile number " + strippedMobileNo + " not found!");
        }
    }

    public boolean verifyOTP(String mobileNo, String otp) {
        String strippedMobileNo = stripCountryCode(mobileNo);
        Optional<User> userOptional = userRepository.findByMobileNo(strippedMobileNo);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getOtp() != null && user.getOtp().equals(otp)) {
                if (LocalDateTime.now().isBefore(user.getOtpExpiryTime())) {
                    clearOTP(user);
                    System.out.println("OTP verified successfully for " + strippedMobileNo);
                    return true;
                } else {
                    System.out.println("OTP expired for " + strippedMobileNo);
                }
            } else {
                System.out.println("OTP mismatch for " + strippedMobileNo + ", Expected: " + user.getOtp() + ", Received: " + otp);
            }
        } else {
            System.out.println("User not found for mobile number: " + strippedMobileNo);
        }
        return false;
    }

    private void clearOTP(User user) {
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
    }

    private String stripCountryCode(String mobileNo) {
        if (mobileNo.startsWith("+91")) {
            return mobileNo.substring(3);
        }
        return mobileNo;
    }

    private String formatMobileNumberForTwilio(String mobileNo) {
        mobileNo = mobileNo.trim();
        if (!mobileNo.startsWith("+")) {
            if (mobileNo.length() == 10 && mobileNo.matches("\\d{10}")) {
                return "+91" + mobileNo; // Assume Indian number if 10 digits
            }
        }
        return mobileNo.startsWith("+") ? mobileNo : "+1" + mobileNo; // Fallback to US format
    }

    private void validateMobileNumber(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10 || !mobileNo.matches("\\d{10}")) {
            throw new IllegalArgumentException("Mobile number must be a 10-digit number!");
        }
    }
}