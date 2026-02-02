package com.raos.invest.dto;

import com.raos.invest.enums.TransactionStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FinancialTransactionDTO(
    Long id,
    Long userId,
    Long accountId,
    Long transactionTypeId,
    TransactionStatus status,
    LocalDate dueDate,
    LocalDate paymentDate,
    BigDecimal value
) {
    public FinancialTransactionDTO(Long id, Long userId, Long accountId, Long transactionTypeId, 
                                 TransactionStatus status, LocalDate dueDate, LocalDate paymentDate, 
                                 BigDecimal value) {
        this.id = id;
        this.userId = userId;
        this.accountId = accountId;
        this.transactionTypeId = transactionTypeId;
        this.status = status;
        this.dueDate = dueDate;
        this.paymentDate = paymentDate;
        this.value = value;
    }
    
    public FinancialTransactionDTO(Long userId, Long accountId, Long transactionTypeId, 
                                 LocalDate dueDate, BigDecimal value) {
        this(null, userId, accountId, transactionTypeId, TransactionStatus.PENDING, dueDate, null, value);
    }
}
