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
import dev.chinhcd.backend.services.IUserService;
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
    private final IUserService userService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        return userService.createRegisterUser(request);
    }

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        userService.checkPackageExpired(user);
        if(user.getIsLocked()) {
            throw new RuntimeException("user is locked");
        }
        boolean isNewUser = user.getName() == null || user.getName().isBlank();

        boolean isAuthenticated = passwordEncoder.matches(request.password(), user.getPassword());
        if (!isAuthenticated)
            throw new BadCredentialsException("Wrong username or password");

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);
        refreshTokenService.deleteByUserId(user.getId());
        refreshTokenService.saveRefreshToken(user, refreshToken, request.rememberMe());
        return new LoginResponse(accessToken, refreshToken, isNewUser);
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        if (!refreshTokenService.isValidRefreshToken(request.refreshToken()))
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN);
        var username = refreshTokenService.extractUserName(request.refreshToken());
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        if(user.getIsLocked()) {
            throw new RuntimeException("user is locked");
        }
        userService.checkPackageExpired(user);
        String accessToken = jwtService.generateAccessToken(user);
        return new RefreshTokenResponse(accessToken, request.refreshToken());
    }

    @Override
    public boolean verifyToken(String token) {
        try {
            String username = jwtService.extractUserName(token);
            var user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
            userService.checkPackageExpired(user);
            return jwtService.isValidAcessToken(token, user);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void logout(LogoutRequest request) {
        if (!refreshTokenService.isValidRefreshToken(request.refreshToken()))
            throw new ServiceException(ErrorCode.INVALID_REFRESH_TOKEN);
        String username = refreshTokenService.extractUserName(request.refreshToken());
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(ErrorCode.USER_NOT_FOUND));
        refreshTokenService.deleteByUserId(user.getId());
    }

}
