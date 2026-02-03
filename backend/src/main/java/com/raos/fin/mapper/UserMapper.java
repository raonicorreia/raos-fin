package com.raos.fin.mapper;

import com.raos.fin.domain.model.Users;
import com.raos.fin.dto.UserDTO;

public class UserMapper {
    
    public static Users toEntity(UserDTO dto) {
        var user = new Users();
        user.setId(dto.id());
        user.setActive(dto.active());
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        return user;
    }
    
    public static UserDTO toDTO(Users entity) {
        return new UserDTO(
            entity.getId(),
            entity.getActive(),
            entity.getName(),
            entity.getEmail(),
            entity.getPassword()
        );
    }
    
    public static void updateEntity(Users entity, UserDTO dto) {
        entity.setActive(dto.active());
        entity.setName(dto.name());
        entity.setEmail(dto.email());
        entity.setPassword(dto.password());
    }
}
