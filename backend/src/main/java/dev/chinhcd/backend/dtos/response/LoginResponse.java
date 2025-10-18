package dev.chinhcd.backend.dtos.response;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {
}
