package com.spectrum1web.controller;

import com.spectrum1web.model.Plan;
import com.spectrum1web.model.Transaction;
import com.spectrum1web.model.User;
import com.spectrum1web.service.PlanService;
import com.spectrum1web.service.TransactionService;
import com.spectrum1web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PlanService planService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/quick-recharge")
    public ResponseEntity<Transaction> quickRecharge(@RequestBody QuickRechargeRequest request) {
        try {
            User user = userService.createOrGetGuestUser(request.getMobileNo());
            Plan plan = planService.getPlanById(request.getPlanId());

            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setPlan(plan);
            transaction.setPaymentMethod(request.getPaymentMethod());
            transaction.setRazorpayPaymentId(request.getRazorpayPaymentId());
            transaction.setTransactionDate(new java.util.Date());

            Transaction savedTransaction = transactionService.addTransaction(transaction);
            return ResponseEntity.ok(savedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}

class QuickRechargeRequest {
    private String mobileNo;
    private Integer planId;
    private String paymentMethod;
    private String razorpayPaymentId;

    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }
    public Integer getPlanId() { return planId; }
    public void setPlanId(Integer planId) { this.planId = planId; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }


//    @GetMapping("/transactions")
//    public ResponseEntity<?> getTransactionsByMobileNo(@RequestParam String mobileNo) {
//        try {
//            if (mobileNo == null || mobileNo.isEmpty()) {
//                return ResponseEntity.badRequest().body(Map.of("error", "Mobile number is required"));
//            }
//
//            List<Transaction> transactions = transactionService.getUserTransactionHistory(mobileNo);
//
//            List<Map<String, Object>> response = transactions.stream()
//                    .map(txn -> {
//                        Map<String, Object> map = new HashMap<>();
//                        map.put("id", txn.getTransactionId());
//                        map.put("planName", txn.getPlanName());
//                        map.put("amount", txn.getPlanPrice());
//                        map.put("date", txn.getTransactionDate());
//                        map.put("status", txn.getStatus().name());
//                        map.put("razorpayPaymentId", txn.getRazorpayPaymentId());
//                        return map;
//                    }).collect(Collectors.toList());
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                Map.of("error", "Failed to fetch transactions: " + e.getMessage()));
//        }
//    }
    
    
}