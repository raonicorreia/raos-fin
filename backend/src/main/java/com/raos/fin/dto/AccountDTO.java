package com.raos.fin.dto;

import java.math.BigDecimal;

public record AccountDTO(
    Long id,
    Boolean active,
    String name,
    BigDecimal balance,
    Long userId
) {
    public AccountDTO(Long id, Boolean active, String name, BigDecimal balance, Long userId) {
        this.id = id;
        this.active = active;
        this.name = name;
        this.balance = balance;
        this.userId = userId;
    }
    
    public AccountDTO(String name, BigDecimal balance, Long userId) {
        this(null, true, name, balance, userId);
    }
}
