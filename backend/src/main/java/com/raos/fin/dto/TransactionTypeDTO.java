package com.raos.fin.dto;

import java.math.BigDecimal;

import com.raos.fin.enums.TransactionType;

public record TransactionTypeDTO(
    Long id,
    Boolean active,
    String name,
    BigDecimal value,
    TransactionType type,
    Integer installments,
    Integer dueDate,
    Boolean monthlyMovement,
    Long userId
) {
    public TransactionTypeDTO(Long id, Boolean active, String name, BigDecimal value, 
                             TransactionType type, Integer installments, Integer dueDate, 
                             Boolean monthlyMovement, Long userId) {
        this.id = id;
        this.active = active;
        this.name = name;
        this.value = value;
        this.type = type;
        this.installments = installments;
        this.dueDate = dueDate;
        this.monthlyMovement = monthlyMovement;
        this.userId = userId;
    }
    
    public TransactionTypeDTO(String name, BigDecimal value, TransactionType type, 
                             Integer installments, Integer dueDate, Boolean monthlyMovement, Long userId) {
        this(null, true, name, value, type, installments, dueDate, monthlyMovement, userId);
    }
}
