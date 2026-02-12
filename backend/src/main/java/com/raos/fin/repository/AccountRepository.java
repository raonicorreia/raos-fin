package com.raos.fin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.raos.fin.domain.model.Account;
import com.raos.fin.dto.AvailableAmountDTO;
import com.raos.fin.enums.TransactionStatus;
import com.raos.fin.enums.TransactionType;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserIdAndActiveTrue(Long userId);
    
    Optional<Account> findByIdAndActiveTrue(Long id);

    @Query("""
    SELECT new com.raos.fin.dto.AvailableAmountDTO(
        COALESCE(SUM(
            CASE 
                WHEN ft.transactionType.type = :debit
                THEN ft.transactionValue * -1
                ELSE ft.transactionValue
            END
        ), 0),

        COALESCE(SUM(
            CASE 
                WHEN ft.status = :paid
                THEN 
                    CASE 
                        WHEN ft.transactionType.type = :debit
                        THEN ft.transactionValue * -1
                        ELSE ft.transactionValue
                    END
                ELSE 0
            END
        ), 0)
    )
    FROM FinancialTransaction ft
    WHERE ft.user.id = :userId
    AND ft.account.id = :accountId
    """)
    AvailableAmountDTO getAvailableAmount(
            @Param("userId") Long userId,
            @Param("accountId") Long accountId,
            @Param("debit") TransactionType debit,
            @Param("paid") TransactionStatus paid
    );

}
