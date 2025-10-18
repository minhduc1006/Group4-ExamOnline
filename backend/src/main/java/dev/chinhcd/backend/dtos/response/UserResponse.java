package dev.chinhcd.backend.dtos.response;

public record UserResponse(
        Long id,
        String username,
        String email,
        String role
) {
}
