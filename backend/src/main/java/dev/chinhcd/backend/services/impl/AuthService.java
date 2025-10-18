package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.LoginRequest;
import dev.chinhcd.backend.dtos.request.LogoutRequest;
import dev.chinhcd.backend.dtos.request.RefreshTokenRequest;
import dev.chinhcd.backend.dtos.request.RegisterRequest;
import dev.chinhcd.backend.dtos.response.LoginResponse;
import dev.chinhcd.backend.dtos.response.RefreshTokenResponse;
import dev.chinhcd.backend.dtos.response.RegisterResponse;
import dev.chinhcd.backend.enums.ErrorCode;
import dev.chinhcd.backend.exception.ServiceException;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.services.IAuthService;
import dev.chinhcd.backend.services.IJwtService;
import dev.chinhcd.backend.services.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IJwtService jwtService;
    private final IRefreshTokenService refreshTokenService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        return null;
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));

        boolean isAuthenticated = passwordEncoder.matches(request.password(), user.getPassword());
        if(!isAuthenticated)
            throw new BadCredentialsException("Wrong username or password");

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);
        refreshTokenService.saveRefreshToken(user, refreshToken, request.rememberMe());
        return new LoginResponse(accessToken, refreshToken);
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        return null;
    }

    @Override
    public boolean verifyToken(String token) {
        return false;
    }

    @Override
    public void logout(LogoutRequest request) {

    }
}
