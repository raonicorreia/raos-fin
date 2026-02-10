package com.raos.fin.dto.auth;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String name,
    Boolean active
) {
    public String type() {
        return "Bearer";
    }
}
