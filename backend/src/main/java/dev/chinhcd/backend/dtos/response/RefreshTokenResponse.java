package dev.chinhcd.backend.dtos.response;

public record RefreshTokenResponse (
        String accessToken,
        String refreshToken
) {

}
