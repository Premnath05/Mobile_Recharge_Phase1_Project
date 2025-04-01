// login.js

// Base URL for API requests (adjust this based on your backend server)
const API_BASE_URL = 'http://localhost:8083/user';

// Utility function to show error messages
function showError(elementId, message, isSuccess = false) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.className = `error-message ${isSuccess ? 'text-success' : ''}`;
    }
}

// Utility function to clear error messages
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Function to toggle between mobile and OTP forms
function toggleForms(showOtpForm) {
    const mobileForm = document.getElementById('mobile-form');
    const otpForm = document.getElementById('otp-form');
    
    if (showOtpForm) {
        mobileForm.classList.remove('active');
        otpForm.classList.add('active');
    } else {
        mobileForm.classList.add('active');
        otpForm.classList.remove('active');
    }
}

// Function to start OTP timer
function startTimer() {
    let timeLeft = 60; // 1 minute in seconds
    const timerElement = document.getElementById('timer');
    const resendButton = document.getElementById('resend-otp');
    
    resendButton.disabled = true;
    
    const countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            resendButton.disabled = false;
            timerElement.textContent = '00:00';
        }
        timeLeft--;
    }, 1000);
}

// Validate input (only allow numbers)
function validateInput(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

// Handle mobile number submission and OTP generation
async function handleMobileSubmit(e) {
    e.preventDefault();
    
    const mobileNumber = document.getElementById('mobile-number').value.trim();
    const mobileDisplay = document.getElementById('mobile-display');
    
    // Clear previous errors
    clearError('mobile-error');
    
    // Client-side validation
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
        showError('mobile-error', 'Please enter a valid 10-digit mobile number starting with 6-9');
        return;
    }

    try {
        // Send POST request to generate OTP (this also checks if user exists)
        const response = await fetch(`${API_BASE_URL}/generate-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'mobileNo': mobileNumber
            })
        });

        const result = await response.text();

        if (response.ok) {
            // Success: Show OTP form
            mobileDisplay.textContent = '+91 ' + mobileNumber;
            sessionStorage.setItem('mobileNumber', mobileNumber); // Store mobile number for OTP verification
            toggleForms(true);
            startTimer();
        } else {
            // Handle specific backend errors
            if (result.includes('User not found')) {
                showError('mobile-error', 'This number is not registered. Please sign up.');
            } else {
                showError('mobile-error', result || 'Failed to send OTP. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error during OTP generation:', error);
        showError('mobile-error', 'An error occurred. Please try again later.');
    }
}

// Handle OTP verification
async function handleOtpSubmit(e) {
    e.preventDefault();
    
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    const otpInputs = document.querySelectorAll('.otp-input');
    let otp = '';
    otpInputs.forEach(input => otp += input.value);
    
    // Clear previous errors
    clearError('otp-error');
    
    // Client-side validation for 6-digit OTP
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        showError('otp-error', 'Please enter a valid 6-digit OTP');
        return;
    }

    try {
        // Send POST request to verify OTP
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'mobileNo': mobileNumber,
                'otp': otp
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Success: Store token and redirect to dashboard
            sessionStorage.setItem('jwtToken', result.token);
            sessionStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'user.html';
        } else {
            // Handle error response from server
            showError('otp-error', result.message || 'Invalid OTP. Please try again.');
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        showError('otp-error', 'An error occurred. Please try again later.');
    }
}

// Handle resend OTP
async function handleResendOtp() {
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    
    clearError('otp-error');
    
    try {
        const response = await fetch(`${API_BASE_URL}/generate-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'mobileNo': mobileNumber
            })
        });

        const result = await response.text();

        if (response.ok) {
            startTimer();
            showError('otp-error', 'OTP resent successfully!', true);
        } else {
            showError('otp-error', result || 'Failed to resend OTP. Please try again.');
        }
    } catch (error) {
        console.error('Error during OTP resend:', error);
        showError('otp-error', 'An error occurred. Please try again later.');
    }
}

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // Mobile form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleMobileSubmit);
        const mobileInput = document.getElementById('mobile-number');
        mobileInput.addEventListener('input', validateInput); // Restrict to numbers
    }

    // OTP form submission
    const otpForm = document.getElementById('otp-verification-form');
    if (otpForm) {
        otpForm.addEventListener('submit', handleOtpSubmit);
    }

    // OTP input handling (move to next input on entry)
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Resend OTP button
    const resendButton = document.getElementById('resend-otp');
    if (resendButton) {
        resendButton.addEventListener('click', handleResendOtp);
    }

    // Toggle menu for mobile view
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
});