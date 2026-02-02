package com.raos.invest.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "account")
public class Account {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FinancialTransaction> financialTransactions = new ArrayList<>();
    
    // Constructors
    public Account() {}
    
    public Account(String name, BigDecimal balance, Users user) {
        this.name = name;
        this.balance = balance;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
    
    public List<FinancialTransaction> getFinancialTransactions() { return financialTransactions; }
    public void setFinancialTransactions(List<FinancialTransaction> financialTransactions) { 
        this.financialTransactions = financialTransactions; 
    }
}
