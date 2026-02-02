package com.raos.invest.mapper;

import com.raos.invest.domain.model.Account;
import com.raos.invest.domain.model.Users;
import com.raos.invest.dto.AccountDTO;

public class AccountMapper {
    
    public static Account toEntity(AccountDTO dto, Users user) {
        var account = new Account();
        account.setId(dto.id());
        account.setActive(dto.active());
        account.setName(dto.name());
        account.setBalance(dto.balance());
        account.setUser(user);
        return account;
    }
    
    public static AccountDTO toDTO(Account entity) {
        return new AccountDTO(
            entity.getId(),
            entity.getActive(),
            entity.getName(),
            entity.getBalance(),
            entity.getUser().getId()
        );
    }
    
    public static void updateEntity(Account entity, AccountDTO dto) {
        entity.setActive(dto.active());
        entity.setName(dto.name());
        entity.setBalance(dto.balance());
    }
}
