package com.spectrum1web.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spectrum1web.exception.ResourceNotFoundException;
import com.spectrum1web.model.Role;
import com.spectrum1web.model.User;
import com.spectrum1web.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPService otpService;

    @Autowired
    private TwilioService twilioService;
    
    

    // Register a new user (unchanged)
    public String registerUser(User user) {
        validateMobileNumber(user.getMobileNo());
        if (userRepository.findByMobileNo(user.getMobileNo()).isPresent()) {
            return "Mobile number already registered!";
        }
        user.setStatus("ACTIVE");
        userRepository.save(user);
        return "User registered successfully!";
    }

    // Create or get a user for guest purchases
    public User createOrGetGuestUser(String mobileNo) {
        validateMobileNumber(mobileNo);
        Optional<User> userOptional = userRepository.findByMobileNo(mobileNo);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }

        // Create a guest user
        User guestUser = new User();
        guestUser.setMobileNo(mobileNo);
        guestUser.setStatus("ACTIVE");
        Role guestRole = new Role();
        guestRole.setRoleId(3); // Assuming roleId 3 is for GUEST; adjust as per your database
        guestUser.setRole(guestRole);
        guestUser.setUsername("Guest_" + mobileNo); // Optional: Set a default username
        return userRepository.save(guestUser);
    }

    // Validate the mobile number (unchanged)
    private void validateMobileNumber(String mobileNo) {
        if (mobileNo == null || mobileNo.length() != 10 || !mobileNo.matches("\\d{10}")) {
            throw new IllegalArgumentException("Mobile number must be a 10-digit number!");
        }
    }

    // Other methods (unchanged)
    public String generateAndSendOTP(String mobileNo) {
        if (mobileNo == null || mobileNo.isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required!");
        }
        Optional<User> userOptional = userRepository.findByMobileNo(mobileNo);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found!");
        }
        String otp = otpService.generateOTP();
        otpService.saveOTP(mobileNo, otp);
        return "OTP sent successfully!";
    }

    public boolean verifyOTPAndLogin(String mobileNo, String otp) {
        if (!mobileNo.startsWith("+")) {
            mobileNo = "+91" + mobileNo.trim();
        }
        return otpService.verifyOTP(mobileNo, otp);
    }

    public User findByMobileNo(String mobileNo) {
        return userRepository.findByMobileNo(mobileNo)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with mobile number: " + mobileNo));
    }

    public List<User> getAllUsersExcludingAdmins() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(user -> !user.getRole().getRoleName().equals(Role.RoleName.ADMIN))
                .collect(Collectors.toList());
    }

    public User updateUserStatus(Integer userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found!"));
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole_RoleName(Role.RoleName.valueOf(role));
    }

    public User adminLogin(String username, String password) {
        return userRepository.findByUsernameAndPasswordAndRole_RoleName(username, password, Role.RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin login failed."));
    }

    public Map<String, Long> getUsersCountByStatus() {
        List<Object[]> result = userRepository.countUsersByStatus();
        Map<String, Long> userStatusCount = new HashMap<>();
        for (Object[] row : result) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            userStatusCount.put(status, count);
        }
        return userStatusCount;
    }
}