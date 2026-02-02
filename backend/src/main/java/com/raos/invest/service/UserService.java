package com.raos.invest.service;

import com.raos.invest.dto.UserDTO;
import com.raos.invest.mapper.UserMapper;
import com.raos.invest.repository.UserRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<UserDTO> findById(@NonNull Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO);
    }
    
    public UserDTO save(UserDTO dto) {
        validateUserDTO(dto);
        
        if (dto.email() != null && userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
        }
        
        var user = UserMapper.toEntity(dto);
        if (user == null) {
            throw new IllegalArgumentException("Usuário não encontrado: " + dto.id());
        }
        var savedUser = userRepository.save(user);
        return UserMapper.toDTO(savedUser);
    }
    
    public Optional<UserDTO> update(@NonNull Long id, UserDTO dto) {
        validateUserDTO(dto);
        
        return userRepository.findById(id)
                .map(user -> {
                    if (dto.email() != null && !dto.email().equals(user.getEmail()) 
                        && userRepository.existsByEmail(dto.email())) {
                        throw new IllegalArgumentException("Email já cadastrado: " + dto.email());
                    }
                    UserMapper.updateEntity(user, dto);
                    if (user == null) {
                        throw new IllegalArgumentException("Usuário não encontrado: " + dto.id());
                    }
                    var updatedUser = userRepository.save(user);
                    return UserMapper.toDTO(updatedUser);
                });
    }
    
    public boolean delete(@NonNull Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }
    
    private void validateUserDTO(UserDTO dto) {
        if (dto.name() == null || dto.name().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (dto.email() == null || dto.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        if (!dto.email().contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        if (dto.password() == null || dto.password().trim().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
    }
}
