package dev.chinhcd.backend.dtos.request;

public record ChangePasswordRequest(
        Long id,
        String password,
        String newPassword
) {
}
