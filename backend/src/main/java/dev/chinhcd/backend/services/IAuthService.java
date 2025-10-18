package dev.chinhcd.backend.services;


import dev.chinhcd.backend.dtos.request.*;
import dev.chinhcd.backend.dtos.response.*;

public interface IAuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse authenticate(LoginRequest request);

    RefreshTokenResponse refreshToken(RefreshTokenRequest request);

    boolean verifyToken(String token);

    void logout(LogoutRequest request);
}
