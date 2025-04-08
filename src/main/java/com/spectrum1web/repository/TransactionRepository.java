package com.spectrum1web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.spectrum1web.model.Transaction;
import java.util.Date;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    
    // Fetch transactions for a user, ordered by transaction date
    List<Transaction> findByUser_UserIdOrderByTransactionDateDesc(Integer userId);

    // Fetch all transactions, ordered by transaction date
    List<Transaction> findAllByOrderByTransactionDateDesc();

    // Fetch transactions expiring within a date range
    @Query("SELECT t FROM Transaction t WHERE t.planExpiryDate BETWEEN :startDate AND :endDate")
    List<Transaction> findTransactionsExpiringSoon(Date startDate, Date endDate);

    // Fetch transactions by user mobile number, ordered by transaction date
    List<Transaction> findByUser_MobileNoOrderByTransactionDateDesc(String mobileNo);

    // Fetch transactions by status (SUCCESS, PENDING, FAILED)
    List<Transaction> findByStatusOrderByTransactionDateDesc(String status);

    // Fetch transactions within an amount range, ordered by transaction date
    List<Transaction> findByAmountBetweenOrderByTransactionDateDesc(Double minAmount, Double maxAmount);
}