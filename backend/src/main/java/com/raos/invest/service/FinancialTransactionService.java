package com.raos.invest.service;

import com.raos.invest.domain.model.Account;
import com.raos.invest.domain.model.TransactionTypeEntity;
import com.raos.invest.domain.model.Users;
import com.raos.invest.dto.FinancialTransactionDTO;
import com.raos.invest.mapper.FinancialTransactionMapper;
import com.raos.invest.repository.FinancialTransactionRepository;
import com.raos.invest.repository.AccountRepository;
import com.raos.invest.repository.TransactionTypeRepository;
import com.raos.invest.repository.UserRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FinancialTransactionService {
    
    private final FinancialTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    
    public FinancialTransactionService(FinancialTransactionRepository transactionRepository,
                                     UserRepository userRepository,
                                     AccountRepository accountRepository,
                                     TransactionTypeRepository transactionTypeRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionTypeRepository = transactionTypeRepository;
    }
    
    public List<FinancialTransactionDTO> findByUserId(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(FinancialTransactionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<FinancialTransactionDTO> findByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
                .map(FinancialTransactionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<FinancialTransactionDTO> findById(@NonNull Long id) {
        return transactionRepository.findById(id)
                .map(FinancialTransactionMapper::toDTO);
    }
    
    public FinancialTransactionDTO save(FinancialTransactionDTO dto) {
        validateFinancialTransactionDTO(dto);
        
        var user = userRepository.findById(Objects.requireNonNull(dto.userId()))
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + dto.userId()));
        
        var account = accountRepository.findById(Objects.requireNonNull(dto.accountId()))
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada: " + dto.accountId()));
        
        var transactionType = transactionTypeRepository.findById(Objects.requireNonNull(dto.transactionTypeId()))
                .orElseThrow(() -> new IllegalArgumentException("Tipo de transação não encontrado: " + dto.transactionTypeId()));
        
        validateUserAccess(user, account, transactionType);
        
        var transaction = FinancialTransactionMapper.toEntity(dto, user, account, transactionType);
        if (transaction == null) {
            throw new IllegalArgumentException("Tipo de transação não encontrado: " + dto.transactionTypeId());
        }
        var savedTransaction = transactionRepository.save(transaction);
        return FinancialTransactionMapper.toDTO(savedTransaction);
    }
    
    public Optional<FinancialTransactionDTO> update(@NonNull Long id, FinancialTransactionDTO dto) {
        validateFinancialTransactionDTO(dto);
        
        return transactionRepository.findById(id)
                .map(transaction -> {
                    FinancialTransactionMapper.updateEntity(transaction, dto);
                    if (transaction == null) {
                        throw new IllegalArgumentException("Tipo de transação não encontrado: " + dto.transactionTypeId());
                    }
                    var updatedTransaction = transactionRepository.save(transaction);
                    return FinancialTransactionMapper.toDTO(updatedTransaction);
                });
    }
    
    public boolean delete(@NonNull Long id) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    if (transaction == null) {
                        throw new IllegalArgumentException("Transação não encontrada: " + id);
                    }
                    transactionRepository.delete(transaction);
                    return true;
                })
                .orElse(false);
    }
    
    public Optional<FinancialTransactionDTO> markAsPaid(@NonNull Long id) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    transaction.setStatus(com.raos.invest.enums.TransactionStatus.PAID);
                    transaction.setPaymentDate(LocalDate.now());
                    var updatedTransaction = transactionRepository.save(transaction);
                    return FinancialTransactionMapper.toDTO(updatedTransaction);
                });
    }
    
    private void validateFinancialTransactionDTO(FinancialTransactionDTO dto) {
        if (dto.userId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }
        if (dto.accountId() == null) {
            throw new IllegalArgumentException("ID da conta é obrigatório");
        }
        if (dto.transactionTypeId() == null) {
            throw new IllegalArgumentException("ID do tipo de transação é obrigatório");
        }
        if (dto.value() == null || dto.value().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        if (dto.dueDate() == null) {
            throw new IllegalArgumentException("Data de vencimento é obrigatória");
        }
    }
    
    private void validateUserAccess(Users user, Account account, TransactionTypeEntity transactionType) {
        if (!account.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Conta não pertence ao usuário");
        }
        if (!transactionType.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Tipo de transação não pertence ao usuário");
        }
    }
}
