package dev.chinhcd.backend.services;


import dev.chinhcd.backend.dtos.request.LoginRequest;
import dev.chinhcd.backend.dtos.request.LogoutRequest;
import dev.chinhcd.backend.dtos.request.RefreshTokenRequest;
import dev.chinhcd.backend.dtos.request.RegisterRequest;
import dev.chinhcd.backend.dtos.response.LoginResponse;
import dev.chinhcd.backend.dtos.response.RefreshTokenResponse;
import dev.chinhcd.backend.dtos.response.RegisterResponse;

public interface IAuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse authenticate(LoginRequest request);

    RefreshTokenResponse refreshToken(RefreshTokenRequest request);

    boolean verifyToken(String token);

    void logout(LogoutRequest request);
}
