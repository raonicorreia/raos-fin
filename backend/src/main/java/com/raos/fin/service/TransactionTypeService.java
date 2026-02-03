package com.raos.fin.service;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raos.fin.dto.TransactionTypeDTO;
import com.raos.fin.mapper.TransactionTypeMapper;
import com.raos.fin.repository.TransactionTypeRepository;
import com.raos.fin.repository.UserRepository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionTypeService {
    
    private final TransactionTypeRepository transactionTypeRepository;
    private final UserRepository userRepository;
    
    public TransactionTypeService(TransactionTypeRepository transactionTypeRepository, 
                                UserRepository userRepository) {
        this.transactionTypeRepository = transactionTypeRepository;
        this.userRepository = userRepository;
    }
    
    public List<TransactionTypeDTO> findByUserId(Long userId) {
        return transactionTypeRepository.findByUserIdAndActiveTrue(userId).stream()
                .map(TransactionTypeMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<TransactionTypeDTO> findById(@NonNull Long id) {
        return transactionTypeRepository.findById(id)
                .map(TransactionTypeMapper::toDTO);
    }
    
    public TransactionTypeDTO save(TransactionTypeDTO dto) {
        validateTransactionTypeDTO(dto);
        
        var user = userRepository.findById(Objects.requireNonNull(dto.userId()))
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + dto.userId()));
        
        var transactionType = TransactionTypeMapper.toEntity(dto, user);
        if (transactionType == null) {
            throw new IllegalArgumentException("Tipo de transação não encontrado: " + dto.id());
        }
        var savedTransactionType = transactionTypeRepository.save(transactionType);
        return TransactionTypeMapper.toDTO(savedTransactionType);
    }
    
    public Optional<TransactionTypeDTO> update(@NonNull Long id, TransactionTypeDTO dto) {
        validateTransactionTypeDTO(dto);
        
        return transactionTypeRepository.findById(id)
                .map(transactionType -> {
                    TransactionTypeMapper.updateEntity(transactionType, dto);
                    if (transactionType == null) {
                        throw new IllegalArgumentException("Tipo de transação não encontrado: " + dto.id());
                    }
                    var updatedTransactionType = transactionTypeRepository.save(transactionType);
                    return TransactionTypeMapper.toDTO(updatedTransactionType);
                });
    }
    
    public boolean delete(@NonNull Long id) {
        return transactionTypeRepository.findById(id)
                .map(transactionType -> {
                    transactionType.setActive(false);
                    transactionTypeRepository.save(transactionType);
                    return true;
                })
                .orElse(false);
    }
    
    public List<TransactionTypeDTO> findMonthlyMovementsByUserId(Long userId) {
        return transactionTypeRepository.findByUserIdAndMonthlyMovementTrue(userId)
                .stream()
                .map(TransactionTypeMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    private void validateTransactionTypeDTO(TransactionTypeDTO dto) {
        if (dto.name() == null || dto.name().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do tipo de transação é obrigatório");
        }
        if (dto.value() == null || dto.value().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        if (dto.type() == null) {
            throw new IllegalArgumentException("Tipo da transação é obrigatório");
        }
        if (!dto.monthlyMovement() && (dto.installments() == null || dto.installments() < 1)) {
            throw new IllegalArgumentException("Número de parcelas deve ser maior que zero");
        }
        if (dto.dueDate() == null || dto.dueDate() < 1 || dto.dueDate() > 31) {
            throw new IllegalArgumentException("Dia de vencimento deve estar entre 1 e 31");
        }
        if (dto.userId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }
    }
}
