package com.raos.fin.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raos.fin.dto.FinancialTransactionDTO;
import com.raos.fin.service.FinancialTransactionService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/financial-transactions")
public class FinancialTransactionController {
    
    private final FinancialTransactionService transactionService;
    
    public FinancialTransactionController(FinancialTransactionService transactionService) {
        this.transactionService = transactionService;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FinancialTransactionDTO>> findByUserId(@PathVariable Long userId) {
        var transactions = transactionService.findByUserId(userId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<List<FinancialTransactionDTO>> findByUserIdAndDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        var transactions = transactionService.findByUserIdAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FinancialTransactionDTO> findById(@PathVariable long id) {
        return transactionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<FinancialTransactionDTO> create(@Valid @RequestBody FinancialTransactionDTO transactionDTO) {
        var createdTransaction = transactionService.save(transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FinancialTransactionDTO> update(@PathVariable long id, @Valid @RequestBody FinancialTransactionDTO transactionDTO) {
        return transactionService.update(id, transactionDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/mark-as-paid")
    public ResponseEntity<FinancialTransactionDTO> markAsPaid(@PathVariable long id) {
        return transactionService.markAsPaid(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        return transactionService.delete(id) ? 
                ResponseEntity.noContent().build() : 
                ResponseEntity.notFound().build();
    }
}
