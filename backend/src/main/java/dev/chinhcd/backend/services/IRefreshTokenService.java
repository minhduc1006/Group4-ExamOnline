package dev.chinhcd.backend.services;


import dev.chinhcd.backend.models.RefreshToken;
import dev.chinhcd.backend.models.User;

public interface IRefreshTokenService {

    RefreshToken saveRefreshToken(User user, String refreshToken, boolean rememberMe);
    String generateRefreshToken(User user);
    boolean isValidRefreshToken(String token);
    String extractUserName(String token);
    void deleteToken(String token);



}
