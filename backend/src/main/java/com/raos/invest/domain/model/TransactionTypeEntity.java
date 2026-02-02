package com.raos.invest.domain.model;

import com.raos.invest.enums.TransactionType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transaction_types")
public class TransactionTypeEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal transactionValue;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TransactionType type;
    
    @Column(nullable = false)
    private Integer installments = 1;
    
    @Column(nullable = false)
    private Integer dueDate;
    
    @Column(nullable = false)
    private Boolean monthlyMovement = false;
    
    @OneToMany(mappedBy = "transactionType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FinancialTransaction> financialTransactions = new ArrayList<>();
    
    // Constructors
    public TransactionTypeEntity() {}
    
    public TransactionTypeEntity(Users user, String name, BigDecimal transactionValue, TransactionType type, 
                                Integer installments, Integer dueDate, Boolean monthlyMovement) {
        this.user = user;
        this.name = name;
        this.transactionValue = transactionValue;
        this.type = type;
        this.installments = installments;
        this.dueDate = dueDate;
        this.monthlyMovement = monthlyMovement;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public BigDecimal getTransactionValue() { return transactionValue; }
    public void setTransactionValue(BigDecimal transactionValue) { this.transactionValue = transactionValue; }
    
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    
    public Integer getInstallments() { return installments; }
    public void setInstallments(Integer installments) { this.installments = installments; }
    
    public Integer getDueDate() { return dueDate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }
    
    public Boolean getMonthlyMovement() { return monthlyMovement; }
    public void setMonthlyMovement(Boolean monthlyMovement) { this.monthlyMovement = monthlyMovement; }
    
    public List<FinancialTransaction> getFinancialTransactions() { return financialTransactions; }
    public void setFinancialTransactions(List<FinancialTransaction> financialTransactions) { 
        this.financialTransactions = financialTransactions; 
    }
}
