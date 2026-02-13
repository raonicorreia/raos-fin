package com.raos.fin.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import com.raos.fin.dto.AccountDTO;
import com.raos.fin.dto.AvailableAmountDTO;
import com.raos.fin.service.AccountService;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    
    private final AccountService accountService;
    
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountDTO>> findByUserId(@PathVariable @NonNull Long userId) {
        var accounts = accountService.findByUserId(userId);
        return ResponseEntity.ok(accounts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> findById(@PathVariable @NonNull Long id) {
        return accountService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/user/{userId}/available-amount")
    public ResponseEntity<AvailableAmountDTO> getAvailableAmount(@PathVariable @NonNull Long id, @PathVariable @NonNull Long userId) {
        var transactionTypes = accountService.getAvailableAmount(id, userId);
        return ResponseEntity.ok(transactionTypes);
    }
    
    @PostMapping
    public ResponseEntity<AccountDTO> create(@Valid @RequestBody AccountDTO accountDTO) {
        var createdAccount = accountService.save(accountDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> update(@PathVariable(required = true) long id, @Valid @RequestBody AccountDTO accountDTO) {
        return accountService.update(id, accountDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @NonNull Long id) {
        return accountService.delete(id) ? 
                ResponseEntity.noContent().build() : 
                ResponseEntity.notFound().build();
    }
}
