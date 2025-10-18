package dev.chinhcd.backend.services;


import dev.chinhcd.backend.models.User;

import java.util.Date;


public interface IJwtService {
    String extractUserName(String token);

    Date extractExpiredTime(String token);

    String generateAccessToken(User user);

    boolean isValidAcessToken(String token, User user);
}
