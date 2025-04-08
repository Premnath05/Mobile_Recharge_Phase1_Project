package com.spectrum1web.controller;

import com.spectrum1web.exception.ResourceNotFoundException;
import com.spectrum1web.model.*;
import com.spectrum1web.security.CustomUserDetailsService;
import com.spectrum1web.security.JwtResponse;
import com.spectrum1web.security.JwtUtil;
import com.spectrum1web.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


import com.spectrum1web.model.Plan;
import com.spectrum1web.model.Transaction;
import com.spectrum1web.model.User;
import com.spectrum1web.service.PlanService;
import com.spectrum1web.service.TransactionService;
import com.spectrum1web.service.UserService;



import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {
	
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private PlanService planService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private SupportQueryService supportQueryService;

    
    
 // 1. User Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getRole() == null || user.getRole().getRoleId() == null) {
                Role userRole = new Role();
                userRole.setRoleId(1); // Default to USER
                user.setRole(userRole);
            }
            String response = userService.registerUser(user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Registration failed: " + e.getMessage())
            );
        }
    }

    // 2. OTP Generation
    @PostMapping("/generate-otp")
    public ResponseEntity<?> generateOTP(@RequestBody Map<String, String> request) {
        try {
            String mobileNo = request.get("mobileNo");
            String result = userService.generateAndSendOTP(mobileNo);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate/send OTP: " + e.getMessage()));
        }
    }
     
    
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestParam String mobileNo, @RequestParam String otp) {
        try {
            boolean isVerified = userService.verifyOTPAndLogin(mobileNo, otp);
            if (isVerified) {
                UserDetails userDetails = userDetailsService.loadUserByMobileNo(mobileNo);
                String token = jwtUtil.generateToken(userDetails);
                return ResponseEntity.ok(new JwtResponse(token));
            } else {
                return ResponseEntity.badRequest().body("Invalid OTP!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    
    
    
    // 4. Plan Catalog
    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        logger.info("Fetching all plans");
        try {
            List<Plan> plans = planService.getAllPlans();
            if (plans == null || plans.isEmpty()) {
                logger.warn("No plans found in the database");
                return ResponseEntity.ok(Collections.emptyList());
            }
            List<Map<String, Object>> response = plans.stream().map(plan -> {
                Map<String, Object> planData = new HashMap<>();
                planData.put("planId", plan.getPlanId());
                planData.put("planName", plan.getPlanName());
                planData.put("planPrice", plan.getPlanPrice());
                planData.put("data", plan.getData());
                planData.put("validity", plan.getValidity());
                planData.put("benefits", plan.getBenefits());
                planData.put("categoryId", plan.getCategory().getCategoryId());
                return planData;
            }).collect(Collectors.toList());
            logger.info("Successfully fetched {} plans", response.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to fetch plans: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Failed to fetch plans: " + e.getMessage())
            );
        }
    }

    
    


    
    @PostMapping("/purchase-plan")
    public ResponseEntity<Transaction> purchasePlan(@RequestBody PurchaseRequest purchaseRequest) {
        try {
            // Get authenticated user from SecurityContext
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userService.findByUsername(userDetails.getUsername());

            // Fetch the plan
            Plan plan = planService.getPlanById(purchaseRequest.getPlanId());

            // Create and populate transaction
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setPlan(plan);
            transaction.setPaymentMethod(purchaseRequest.getPaymentMethod());
            transaction.setRazorpayPaymentId(purchaseRequest.getRazorpayPaymentId());
            transaction.setTransactionDate(new java.util.Date());

            // Save transaction
            Transaction savedTransaction = transactionService.addTransaction(transaction);

            return ResponseEntity.ok(savedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Handle errors gracefully
        }
    }
}

class PurchaseRequest {
    private Integer planId;
    private String paymentMethod;
    private String razorpayPaymentId;

    public Integer getPlanId() { return planId; }
    public void setPlanId(Integer planId) { this.planId = planId; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    
    


    // 6. Transaction History
    @GetMapping("/transactions")
    public ResponseEntity<?> getUserTransactions(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            User user = userService.findByMobileNo(authentication.getName());
            List<Transaction> transactions = transactionService.getUserTransactions(user.getUserId());

            List<Map<String, Object>> response = transactions.stream()
                    .map(txn -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", txn.getTransactionId());
                        map.put("planName", txn.getPlanName());
                        map.put("amount", txn.getPlanPrice());
                        map.put("date", txn.getTransactionDate());
                        map.put("status", txn.getStatus().name());
                        return map;
                    }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Failed to fetch transactions")
            );
        }
    }

    // 7. Current Active Plan
    @GetMapping("/current-plan")
    public ResponseEntity<?> getCurrentPlan(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            User user = userService.findByMobileNo(authentication.getName());
            Transaction currentPlan = transactionService.getCurrentPlan(user.getUserId());

            if (currentPlan == null) {
                return ResponseEntity.ok(
                    Map.of("message", "No active plan found")
                );
            }

            Map<String, Object> response = new HashMap<>();
            response.put("planName", currentPlan.getPlanName());
            response.put("expiryDate", currentPlan.getPlanExpiryDate());
            response.put("remainingDays", 
                (currentPlan.getPlanExpiryDate().getTime() - System.currentTimeMillis()) / (1000 * 60 * 60 * 24));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", e.getMessage())
            );
        }
    }

    // 8. Support Query
    @PostMapping("/contact-us")
    public ResponseEntity<?> submitQuery(
            @RequestBody SupportQuery supportQuery,
            @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(jwtToken);
            User loggedInUser = userService.findByUsername(username);
            
            supportQuery.setUserId(loggedInUser.getUserId());
            supportQueryService.saveQuery(supportQuery);
            
            return ResponseEntity.ok(
                Map.of("message", "Query submitted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Failed to submit query")
            );
        }
    }
}