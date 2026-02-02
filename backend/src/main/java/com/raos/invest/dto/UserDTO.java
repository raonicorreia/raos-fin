package com.raos.invest.dto;

public record UserDTO(
    Long id,
    Boolean active,
    String name,
    String email,
    String password
) {
    public UserDTO(Long id, Boolean active, String name, String email, String password) {
        this.id = id;
        this.active = active;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    
    public UserDTO(String name, String email, String password) {
        this(null, true, name, email, password);
    }
}
