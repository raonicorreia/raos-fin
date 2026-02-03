package com.raos.fin.mapper;

import com.raos.fin.domain.model.TransactionTypeEntity;
import com.raos.fin.domain.model.Users;
import com.raos.fin.dto.TransactionTypeDTO;

public class TransactionTypeMapper {
    
    public static TransactionTypeEntity toEntity(TransactionTypeDTO dto, Users user) {
        var transactionType = new TransactionTypeEntity();
        transactionType.setId(dto.id());
        transactionType.setActive(dto.active());
        transactionType.setName(dto.name());
        transactionType.setTransactionValue(dto.value());
        transactionType.setType(dto.type());
        transactionType.setInstallments(dto.installments());
        transactionType.setDueDate(dto.dueDate());
        transactionType.setMonthlyMovement(dto.monthlyMovement());
        transactionType.setUser(user);
        return transactionType;
    }
    
    public static TransactionTypeDTO toDTO(TransactionTypeEntity entity) {
        return new TransactionTypeDTO(
            entity.getId(),
            entity.getActive(),
            entity.getName(),
            entity.getTransactionValue(),
            entity.getType(),
            entity.getInstallments(),
            entity.getDueDate(),
            entity.getMonthlyMovement(),
            entity.getUser().getId()
        );
    }
    
    public static void updateEntity(TransactionTypeEntity entity, TransactionTypeDTO dto) {
        entity.setActive(dto.active());
        entity.setName(dto.name());
        entity.setTransactionValue(dto.value());
        entity.setType(dto.type());
        entity.setInstallments(dto.installments());
        entity.setDueDate(dto.dueDate());
        entity.setMonthlyMovement(dto.monthlyMovement());
    }
}
