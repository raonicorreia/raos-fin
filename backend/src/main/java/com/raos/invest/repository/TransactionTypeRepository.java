package com.raos.invest.repository;

import com.raos.invest.domain.model.TransactionTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionTypeRepository extends JpaRepository<TransactionTypeEntity, Long> {
    List<TransactionTypeEntity> findByUserIdAndActiveTrue(Long userId);
    List<TransactionTypeEntity> findByUserIdAndMonthlyMovementTrue(Long userId);
}
