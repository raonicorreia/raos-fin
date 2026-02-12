package com.raos.fin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.raos.fin.domain.model.TransactionTypeEntity;

import java.util.List;

@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionTypeEntity, Long> {
    List<TransactionTypeEntity> findByUserIdAndActiveTrue(Long userId);
    List<TransactionTypeEntity> findByUserIdAndMonthlyMovementTrue(Long userId);
    List<TransactionTypeEntity> findByUserIdAndAccountIdAndActiveTrue(Long userId, Long accountId);
    List<TransactionTypeEntity> findByUserIdAndAccountIdAndMonthlyMovementTrue(Long userId, Long accountId);
}
