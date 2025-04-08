package com.spectrum1web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.spectrum1web.model.Role;
import com.spectrum1web.model.User;
import com.spectrum1web.repository.UserRepository;
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // No role check here; allow loading any user
        return user;
    }

    public UserDetails loadUserByMobileNo(String mobileNo) throws UsernameNotFoundException {
        User user = userRepository.findByMobileNo(mobileNo)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with mobile number: " + mobileNo));

        // No role check here; allow loading any user
        return user;
    }
}