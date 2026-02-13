package com.raos.fin.service;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raos.fin.domain.model.Account;
import com.raos.fin.dto.AccountDTO;
import com.raos.fin.dto.AvailableAmountDTO;
import com.raos.fin.enums.TransactionStatus;
import com.raos.fin.enums.TransactionType;
import com.raos.fin.mapper.AccountMapper;
import com.raos.fin.repository.AccountRepository;
import com.raos.fin.repository.UserRepository;

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
    
    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
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

    public AvailableAmountDTO getAvailableAmount(@NonNull Long accountId, @NonNull Long userId) {
        AvailableAmountDTO available = this.accountRepository.getAvailableAmount(userId, accountId, TransactionType.DEBIT, TransactionStatus.PAID);
        Optional<Account> accountOpt = this.accountRepository.findById(accountId);
        if (accountOpt.isPresent()) {
            Account account = accountOpt.get();
            BigDecimal newCurrent = available.current().add(account.getBalance());
            BigDecimal newEstimated = available.estimated().add(account.getBalance());
            available = new AvailableAmountDTO(newCurrent, newEstimated);
        }
        return available;
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
