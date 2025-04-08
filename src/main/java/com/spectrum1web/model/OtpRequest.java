
package com.spectrum1web.model;

public class OtpRequest {
    private String mobileNo;
    private String otp;

    // Default constructor
    public OtpRequest() {}

    // Parameterized constructor
    public OtpRequest(String mobileNo, String otp) {
        this.mobileNo = mobileNo;
        this.otp = otp;
    }

    // Getters and Setters
    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}