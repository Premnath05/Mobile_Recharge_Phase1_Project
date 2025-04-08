package com.spectrum1web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spectrum1web.model.Plan;
import com.spectrum1web.model.Transaction;
import com.spectrum1web.model.TransactionStatus;
import com.spectrum1web.model.User;
import com.spectrum1web.repository.PlanRepository;
import com.spectrum1web.repository.TransactionRepository;
import com.spectrum1web.repository.UserRepository;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    // ✅ Add a new transaction
    public Transaction addTransaction(Transaction transaction) {
        if (transaction.getPlanExpiryDate() == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            String validity = transaction.getPlan().getValidity();
            int days = Integer.parseInt(validity.split(" ")[0]); // Extract number
            calendar.add(Calendar.DAY_OF_MONTH, days);
            transaction.setPlanExpiryDate(calendar.getTime());
        }

        // Set transaction amount from plan price
        transaction.setAmount(transaction.getPlan().getPlanPrice());

        // Set default transaction status and action
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setAction("Recharge Successful");

        // NEW: Populate additional fields
        transaction.setUsername(transaction.getUser().getUsername());
        transaction.setMobileNo(transaction.getUser().getMobileNo());
        transaction.setPlanName(transaction.getPlan().getPlanName());
        transaction.setPlanPrice(transaction.getPlan().getPlanPrice());
        transaction.setPlanValidity(transaction.getPlan().getValidity());
        transaction.setPlanDetailsContent(transaction.getPlan().getPlanDetailsContent());

        return transactionRepository.save(transaction);
    }

    // ✅ Fetch transactions for a user
    public List<Transaction> getUserTransactions(Integer userId) {
        return transactionRepository.findByUser_UserIdOrderByTransactionDateDesc(userId);
    }

    // ✅ Fetch all recent transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc();
    }

    // ✅ Fetch transactions expiring soon (within the next 3 days)
    public List<Transaction> getTransactionsExpiringSoon() {
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);
        calendar.add(Calendar.DAY_OF_MONTH, 3);
        Date expiryDate = calendar.getTime();

        return transactionRepository.findTransactionsExpiringSoon(today, expiryDate);
    }

    // ✅ Fetch the current active plan for a user
    public Transaction getCurrentPlan(Integer userId) {
        List<Transaction> transactions = transactionRepository.findByUser_UserIdOrderByTransactionDateDesc(userId);
        Date today = new Date();

        for (Transaction transaction : transactions) {
            if (transaction.getPlanExpiryDate() != null && transaction.getPlanExpiryDate().after(today)) {
                return transaction; // Return the first active plan
            }
        }

        return null; // No active plan found
    }

    // ✅ Fetch transaction history for a user by mobile number
    public List<Transaction> getUserTransactionHistory(String mobileNo) {
        return transactionRepository.findByUser_MobileNoOrderByTransactionDateDesc(mobileNo);
    }

    // ✅ Fetch transactions by status (SUCCESS, PENDING, FAILED)
    public List<Transaction> getTransactionsByStatus(TransactionStatus status) {
        return transactionRepository.findByStatusOrderByTransactionDateDesc(status.name());
    }

    // ✅ Fetch transactions within an amount range
    public List<Transaction> getTransactionsByAmountRange(Double minAmount, Double maxAmount) {
        return transactionRepository.findByAmountBetweenOrderByTransactionDateDesc(minAmount, maxAmount);
    }
}