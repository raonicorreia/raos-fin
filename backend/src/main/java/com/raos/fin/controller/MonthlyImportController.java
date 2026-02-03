package com.raos.fin.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.raos.fin.dto.FinancialTransactionDTO;
import com.raos.fin.dto.MonthlyImportRequest;
import com.raos.fin.service.MonthlyImportService;

import java.util.List;

@RestController
@RequestMapping("/api/monthly-import")
public class MonthlyImportController {
    
    private final MonthlyImportService monthlyImportService;
    
    public MonthlyImportController(MonthlyImportService monthlyImportService) {
        this.monthlyImportService = monthlyImportService;
    }
    
    @PostMapping
    public ResponseEntity<List<FinancialTransactionDTO>> importMonthlyMovements(@Valid @RequestBody MonthlyImportRequest request) {
        var importedTransactions = monthlyImportService.importMonthlyMovements(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(importedTransactions);
    }
}
