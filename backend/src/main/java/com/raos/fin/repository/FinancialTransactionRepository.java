package com.raos.fin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.raos.fin.domain.model.FinancialTransaction;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {
    
    List<FinancialTransaction> findByUserId(Long userId);
    
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.user.id = :userId " +
           "AND ft.dueDate BETWEEN :startDate AND :endDate ORDER BY ft.dueDate")
    List<FinancialTransaction> findByUserIdAndDateRange(@Param("userId") Long userId,
                                                        @Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate);
    
    List<FinancialTransaction> findByUserIdAndStatus(Long userId, String status);
}
