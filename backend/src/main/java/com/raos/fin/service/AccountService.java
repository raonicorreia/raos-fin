package com.raos.fin.service;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raos.fin.dto.AccountDTO;
import com.raos.fin.enums.TransactionType;
import com.raos.fin.mapper.AccountMapper;
import com.raos.fin.repository.AccountRepository;
import com.raos.fin.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final FinancialTransactionService financialTransactionService;
    
    public AccountService(AccountRepository accountRepository, UserRepository userRepository,
        FinancialTransactionService financialTransactionService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.financialTransactionService = financialTransactionService;
    }
    
    public List<AccountDTO> findByUserId(Long userId) {
        return accountRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(AccountMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<AccountDTO> findById(@NonNull Long id) {
        return accountRepository.findById(id)
                .map(AccountMapper::toDTO);
    }
    
    public AccountDTO save(AccountDTO dto) {
        validateAccountDTO(dto);
        
        var user = userRepository.findById(Objects.requireNonNull(dto.userId()))
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + dto.userId()));
        
        var account = AccountMapper.toEntity(dto, user);
        if (account == null) {
            throw new IllegalArgumentException("Conta não pode ser nula");
        }
        var savedAccount = accountRepository.save(account);
        return AccountMapper.toDTO(savedAccount);
    }
    
    public Optional<AccountDTO> update(@NonNull Long id, AccountDTO dto) {
        validateAccountDTO(dto);
        
        return accountRepository.findById(id)
                .map(account -> {
                    AccountMapper.updateEntity(account, dto);
                    if (account == null) {
                        throw new IllegalArgumentException("Conta não pode ser nula");
                    }
                    var updatedAccount = accountRepository.save(account);
                    return AccountMapper.toDTO(updatedAccount);
                });
    }
    
    public boolean delete(@NonNull Long id) {
        return accountRepository.findById(id)
                .map(account -> {
                    account.setActive(false);
                    accountRepository.save(account);
                    return true;
                })
                .orElse(false);
    }

    public BigDecimal getAvailableAmount(Long accountId, Long userId) {
        return accountRepository.findByIdAndActiveTrue(accountId)
            .map(account -> account.getBalance()
                .add(financialTransactionService.getAvailableAmount(userId, accountId)))
            .orElse(BigDecimal.ZERO);
    }
    
    private void validateAccountDTO(AccountDTO dto) {
        if (dto.name() == null || dto.name().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome da conta é obrigatório");
        }
        if (dto.balance() == null || dto.balance().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Saldo não pode ser negativo");
        }
        if (dto.userId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }
    }
}
