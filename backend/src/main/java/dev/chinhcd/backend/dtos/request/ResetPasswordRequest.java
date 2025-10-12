package dev.chinhcd.backend.dtos.request;

public record ResetPasswordRequest(
        String token,
        String password
) {
}