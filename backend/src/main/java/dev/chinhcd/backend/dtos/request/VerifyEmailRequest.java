package dev.chinhcd.backend.dtos.request;

public record VerifyEmailRequest(
        Long id,
        String email
) {
}
