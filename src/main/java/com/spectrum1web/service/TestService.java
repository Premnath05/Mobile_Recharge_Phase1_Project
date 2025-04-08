package com.spectrum1web.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spectrum1web.model.User;
import com.spectrum1web.repository.UserRepository;

@Service
public class TestService {

    @Autowired
    private UserRepository userRepository;

    public void testFindByMobileNo() {
        String mobileNo = "9566304593";
        Optional<User> userOptional = userRepository.findByMobileNo(mobileNo);
        if (userOptional.isPresent()) {
            System.out.println("User found: " + userOptional.get());
        } else {
            System.out.println("User not found with mobile number: " + mobileNo);
        }
    }
}