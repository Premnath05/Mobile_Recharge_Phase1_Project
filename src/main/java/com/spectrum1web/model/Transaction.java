package com.spectrum1web.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    private String username;
    private String mobileNo;
    private String planName;
    private Double planPrice;
    private String planValidity;
    private String planDetailsContent;

    @Temporal(TemporalType.TIMESTAMP)
    private Date transactionDate = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date planExpiryDate;

    private Double amount;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private String action;

    @Column(name = "is_quick_recharge")
    private Boolean isQuickRecharge = false;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature")
    private String razorpaySignature;
}