package dev.chinhcd.backend.dtos.response;


import dev.chinhcd.backend.enums.Role;

public record RegisterResponse(
        Long id,
        String username,
        String email,
        Role role
) {
}
