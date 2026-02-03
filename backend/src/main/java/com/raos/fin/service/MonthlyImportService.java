package com.raos.fin.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raos.fin.domain.model.Account;
import com.raos.fin.domain.model.FinancialTransaction;
import com.raos.fin.domain.model.TransactionTypeEntity;
import com.raos.fin.domain.model.Users;
import com.raos.fin.dto.FinancialTransactionDTO;
import com.raos.fin.dto.MonthlyImportRequest;
import com.raos.fin.mapper.FinancialTransactionMapper;
import com.raos.fin.repository.AccountRepository;
import com.raos.fin.repository.FinancialTransactionRepository;
import com.raos.fin.repository.TransactionTypeRepository;
import com.raos.fin.repository.UserRepository;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class MonthlyImportService {
    
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final FinancialTransactionRepository transactionRepository;
    
    public MonthlyImportService(UserRepository userRepository,
                              AccountRepository accountRepository,
                              TransactionTypeRepository transactionTypeRepository,
                              FinancialTransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionTypeRepository = transactionTypeRepository;
        this.transactionRepository = transactionRepository;
    }
    
    public List<FinancialTransactionDTO> importMonthlyMovements(MonthlyImportRequest request) {
        validateRequest(request);
        
        var user = userRepository.findById(Objects.requireNonNull(request.userId()))
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + request.userId()));
        
        var monthlyTransactionTypes = transactionTypeRepository
                .findByUserIdAndMonthlyMovementTrue(Objects.requireNonNull(request.userId()));
        
        if (monthlyTransactionTypes.isEmpty()) {
            return List.of();
        }
        
        var accounts = accountRepository.findByUserIdAndActiveTrue(request.userId());
        if (accounts.isEmpty()) {
            throw new IllegalArgumentException("Usuário não possui contas cadastradas");
        }
        
        var defaultAccount = accounts.get(0);
        
        var transactions = monthlyTransactionTypes.stream()
                .map(transactionType -> createMonthlyTransaction(user, defaultAccount, transactionType, 
                                                               request.month(), request.year()))
                .collect(Collectors.toList());
        if (transactions.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma transação mensal encontrada para o usuário");
        }
        var savedTransactions = transactionRepository.saveAll(transactions);
        
        return savedTransactions.stream()
                .map(FinancialTransactionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    private FinancialTransaction createMonthlyTransaction(Users user, Account account, 
                                                        TransactionTypeEntity transactionType, 
                                                        Integer month, Integer year) {
        var dueDate = LocalDate.of(year, month, Math.min(transactionType.getDueDate(), 
                                                        LocalDate.of(year, month, 1).lengthOfMonth()));
        
        var transaction = new FinancialTransaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setTransactionType(transactionType);
        transaction.setStatus(com.raos.fin.enums.TransactionStatus.PENDING);
        transaction.setDueDate(dueDate);
        transaction.setTransactionValue(transactionType.getTransactionValue());
        
        return transaction;
    }
    
    private void validateRequest(MonthlyImportRequest request) {
        if (request.userId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }
        if (request.month() == null || request.month() < 1 || request.month() > 12) {
            throw new IllegalArgumentException("Mês deve estar entre 1 e 12");
        }
        if (request.year() == null || request.year() < 2020 || request.year() > Year.now().getValue() + 1) {
            throw new IllegalArgumentException("Ano inválido");
        }
    }
}
