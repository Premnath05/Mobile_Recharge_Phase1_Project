package com.spectrum1web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.spectrum1web.model.Category;
import com.spectrum1web.model.Plan;
import com.spectrum1web.model.SupportQuery;
import com.spectrum1web.model.Transaction;
import com.spectrum1web.model.User;
import com.spectrum1web.repository.CategoryRepository;
import com.spectrum1web.security.CustomUserDetailsService;
import com.spectrum1web.security.JwtResponse;
import com.spectrum1web.security.JwtUtil;
import com.spectrum1web.service.CategoryService;
import com.spectrum1web.service.NotificationService;
import com.spectrum1web.service.PlanService;
import com.spectrum1web.service.SupportQueryService;
import com.spectrum1web.service.TransactionService;
import com.spectrum1web.service.UserService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;    

    @Autowired
    private PlanService planService;
 
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private SupportQueryService supportQueryService; 
   
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestParam String username, @RequestParam String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin login failed: " + e.getMessage());
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        try {
            if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
                return ResponseEntity.badRequest().body("Category name is required!");
            }
            Category newCategory = categoryService.addCategory(category);
            return ResponseEntity.ok(newCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add category: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            Category existingCategory = categoryService.getCategoryById(id);
            if (existingCategory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with ID " + id + " not found!");
            }
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete category: " + e.getMessage());
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            if (categories.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No categories available.");
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch categories: " + e.getMessage());
        }
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        try {
            Category category = categoryService.getCategoryById(id);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with ID " + id + " not found!");
            }
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch category: " + e.getMessage());
        }
    }

    @PostMapping("/plans")
    public ResponseEntity<?> addPlan(@RequestBody Map<String, Object> planData) {
        try {
            String planName = (String) planData.get("planName");
            Double planPrice = planData.get("planPrice") != null ? ((Number) planData.get("planPrice")).doubleValue() : null;
            String data = (String) planData.get("data");
            String validity = (String) planData.get("validity");
            String benefits = (String) planData.get("benefits");
            String planDetailsContent = (String) planData.get("planDetailsContent");
            Integer categoryId = (Integer) planData.get("categoryId");

            if (planName == null || planPrice == null || categoryId == null) {
                return ResponseEntity.badRequest().body("Plan name, price, and category ID are required!");
            }

            Category category = categoryService.getCategoryById(categoryId);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with ID " + categoryId + " not found!");
            }

            Plan plan = new Plan();
            plan.setPlanName(planName);
            plan.setPlanPrice(planPrice);
            plan.setData(data);
            plan.setValidity(validity);
            plan.setBenefits(benefits);
            plan.setPlanDetailsContent(planDetailsContent);
            plan.setCategory(category);

            Plan savedPlan = planService.addPlan(plan);
            return ResponseEntity.ok(savedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add plan: " + e.getMessage());
        }
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Integer id, @RequestBody Plan plan) {
        try {
            Plan existingPlan = planService.getPlanById(id);
            if (existingPlan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan with ID " + id + " not found!");
            }
            plan.setPlanId(id);
            Plan updatedPlan = planService.updatePlan(plan);
            return ResponseEntity.ok(updatedPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update plan: " + e.getMessage());
        }
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Integer id) {
        try {
            Plan existingPlan = planService.getPlanById(id);
            if (existingPlan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan with ID " + id + " not found!");
            }
            planService.deletePlan(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete plan: " + e.getMessage());
        }
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getAllPlans() {
        try {
            List<Plan> plans = planService.getAllPlans();
            if (plans.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No plans available.");
            }
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch plans: " + e.getMessage());
        }
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable Integer id) {
        try {
            Plan plan = planService.getPlanById(id);
            if (plan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan with ID " + id + " not found!");
            }
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch plan: " + e.getMessage());
        }
    }

    @PutMapping("/users/status")
    public ResponseEntity<String> updateUserStatus(
            @RequestParam Integer userId,
            @RequestParam String status) {
        try {
            User user = userService.updateUserStatus(userId, status);
            return ResponseEntity.ok("User status updated to " + status + " for user ID " + userId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/support-queries")
    public ResponseEntity<List<SupportQuery>> getAllSupportQueries() {
        List<SupportQuery> queries = supportQueryService.getAllQueries();
        return ResponseEntity.ok(queries);
    }

    @GetMapping("/expiring-plans")
    public ResponseEntity<?> getExpiringPlans() {
        try {
            List<Transaction> expiringTransactions = transactionService.getTransactionsExpiringSoon();
            if (expiringTransactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No plans expiring in the next 3 days.");
            }
            return ResponseEntity.ok(expiringTransactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch expiring plans: " + e.getMessage());
        }
    }

    @PostMapping("/send-expiry-notifications")
    public ResponseEntity<String> sendExpiryNotifications() {
        List<Transaction> expiringTransactions = transactionService.getTransactionsExpiringSoon();
        for (Transaction transaction : expiringTransactions) {
            String mobileNo = transaction.getUser().getMobileNo();
            String message = "Your plan is expiring in 3 days! Please renew to avoid service interruption.";
            notificationService.sendManualNotification(mobileNo, message);
        }
        return ResponseEntity.ok("Notifications sent successfully!");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsersExcludingAdmins();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<?> getAllTransactions() {
        try {
            List<Transaction> transactions = transactionService.getAllTransactions();
            if (transactions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No transactions found.");
            }
            List<Map<String, Object>> response = transactions.stream().map(transaction -> {
                Map<String, Object> transactionData = new HashMap<>();
                transactionData.put("transactionId", transaction.getTransactionId());
                transactionData.put("username", transaction.getUsername());
                transactionData.put("mobileNo", transaction.getMobileNo());
                transactionData.put("planName", transaction.getPlanName());
                transactionData.put("planPrice", transaction.getPlanPrice());
                transactionData.put("planValidity", transaction.getPlanValidity());
                transactionData.put("planDetailsContent", transaction.getPlanDetailsContent());
                transactionData.put("transactionDate", transaction.getTransactionDate());
                transactionData.put("planExpiryDate", transaction.getPlanExpiryDate());
                transactionData.put("status", transaction.getStatus().name());
                transactionData.put("action", transaction.getAction());
                transactionData.put("paymentMethod", transaction.getPaymentMethod());
                return transactionData;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch transactions: " + e.getMessage());
        }
    }

    @GetMapping("/users/count-by-status")
    public ResponseEntity<Map<String, Long>> getUsersCountByStatus() {
        Map<String, Long> userStatusCount = userService.getUsersCountByStatus();
        return ResponseEntity.ok(userStatusCount);
    }

    @GetMapping("/total-plans")
    public ResponseEntity<?> getTotalPlans() {
        try {
            long totalPlans = planService.getTotalPlans();
            Map<String, Long> response = new HashMap<>();
            response.put("totalPlans", totalPlans);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch total plans: " + e.getMessage());
        }
    }
}