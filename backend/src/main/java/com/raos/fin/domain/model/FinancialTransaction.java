package com.raos.fin.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.raos.fin.enums.TransactionStatus;

@Entity
@Table(name = "financial_transactions")
public class FinancialTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_types_id", nullable = false)
    @NotNull
    private TransactionTypeEntity transactionType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDate dueDate;
    
    private LocalDate paymentDate;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal transactionValue;
    
    // Constructors
    public FinancialTransaction() {}
    
    public FinancialTransaction(Users user, Account account, TransactionTypeEntity transactionType, 
                              LocalDate dueDate, BigDecimal transactionValue) {
        this.user = user;
        this.account = account;
        this.transactionType = transactionType;
        this.dueDate = dueDate;
        this.transactionValue = transactionValue;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
    
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
    
    public TransactionTypeEntity getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionTypeEntity transactionType) { 
        this.transactionType = transactionType; 
    }
    
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    
    public BigDecimal getTransactionValue() { return transactionValue; }
    public void setTransactionValue(BigDecimal value) { this.transactionValue = value; }
}
