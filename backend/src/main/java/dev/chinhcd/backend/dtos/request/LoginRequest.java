package dev.chinhcd.backend.dtos.request;

public record LoginRequest(
        String username,
        String password,
        boolean rememberMe
) {
}
