package com.raos.invest.controller;

import com.raos.invest.dto.TransactionTypeDTO;
import com.raos.invest.service.TransactionTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction-types")
public class TransactionTypeController {
    
    private final TransactionTypeService transactionTypeService;
    
    public TransactionTypeController(TransactionTypeService transactionTypeService) {
        this.transactionTypeService = transactionTypeService;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionTypeDTO>> findByUserId(@PathVariable Long userId) {
        var transactionTypes = transactionTypeService.findByUserId(userId);
        return ResponseEntity.ok(transactionTypes);
    }
    
    @GetMapping("/user/{userId}/monthly")
    public ResponseEntity<List<TransactionTypeDTO>> findMonthlyMovementsByUserId(@PathVariable Long userId) {
        var monthlyMovements = transactionTypeService.findMonthlyMovementsByUserId(userId);
        return ResponseEntity.ok(monthlyMovements);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TransactionTypeDTO> findById(@PathVariable long id) {
        return transactionTypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<TransactionTypeDTO> create(@Valid @RequestBody TransactionTypeDTO transactionTypeDTO) {
        var createdTransactionType = transactionTypeService.save(transactionTypeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransactionType);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionTypeDTO> update(@PathVariable long id, @Valid @RequestBody TransactionTypeDTO transactionTypeDTO) {
        return transactionTypeService.update(id, transactionTypeDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        return transactionTypeService.delete(id) ? 
                ResponseEntity.noContent().build() : 
                ResponseEntity.notFound().build();
    }
}
