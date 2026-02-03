package com.raos.invest.mapper;

import com.raos.invest.domain.model.FinancialTransaction;
import com.raos.invest.domain.model.Account;
import com.raos.invest.domain.model.TransactionTypeEntity;
import com.raos.invest.domain.model.Users;
import com.raos.invest.dto.FinancialTransactionDTO;

public class FinancialTransactionMapper {
    
    public static FinancialTransaction toEntity(FinancialTransactionDTO dto, Users user, 
                                              Account account, TransactionTypeEntity transactionType) {
        var transaction = new FinancialTransaction();
        transaction.setId(dto.id());
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setTransactionType(transactionType);
        transaction.setStatus(dto.status());
        transaction.setDueDate(dto.dueDate());
        transaction.setPaymentDate(dto.paymentDate());
        transaction.setTransactionValue(dto.value());
        return transaction;
    }
    
    public static FinancialTransactionDTO toDTO(FinancialTransaction entity) {
        return new FinancialTransactionDTO(
            entity.getId(),
            entity.getUser().getId(),
            entity.getAccount().getId(),
            entity.getTransactionType().getId(),
            entity.getTransactionType().getName(),
            entity.getStatus(),
            entity.getDueDate(),
            entity.getPaymentDate(),
            entity.getTransactionValue()
        );
    }
    
    public static void updateEntity(FinancialTransaction entity, FinancialTransactionDTO dto) {
        entity.setStatus(dto.status());
        entity.setDueDate(dto.dueDate());
        entity.setPaymentDate(dto.paymentDate());
        entity.setTransactionValue(dto.value());
    }
}
