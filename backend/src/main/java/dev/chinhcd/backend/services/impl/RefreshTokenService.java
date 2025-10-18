package dev.chinhcd.backend.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import dev.chinhcd.backend.models.RefreshToken;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IRefreshTokenRepository;
import dev.chinhcd.backend.services.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService {
    private final IRefreshTokenRepository refreshTokenRepository;
    @Value("${jwt.refreshSignerKey}")
    private String refreshSignerKey;

    @Value("${jwt.refreshTime}")
    private long refreshTime;

    @Override
    public RefreshToken saveRefreshToken(User user, String refreshToken, boolean rememberMe) {
        Date expireTime = new Date(Instant.now().plusSeconds(rememberMe? refreshTime:60*60*24).toEpochMilli());
        String jid = extractJwtId(refreshToken);
        var token = RefreshToken.builder()
                .id(jid)
                .expiryTime(expireTime)
                .user(user)
                .build();
        return refreshTokenRepository.save(token);
    }

    @Override
    public String generateRefreshToken(User user) {
        var jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .issuer("caodoanhchinh")
                .subject(user.getUsername())
                .issueTime(new Date())
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        var jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(refreshSignerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException exception) {
            throw new RuntimeException(exception);
        }
    }

    @Override
    public boolean isValidRefreshToken(String token) {
        String tokenId = extractJwtId(token);
        var checkedToken = refreshTokenRepository.findById(tokenId)
                .orElse(null);
        return checkedToken != null && checkedToken.getExpiryTime().after(new Date());
    }

    @Override
    public String extractUserName(String token) {
        return extractAllClams(token).getSubject();
    }

    @Override
    public void deleteToken(String token) {
        String tokenId = extractJwtId(token);
        refreshTokenRepository.deleteById(tokenId);
    }

    @Override
    public void deleteByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    private JWTClaimsSet extractAllClams(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            if (!signedJWT.verify(new MACVerifier(refreshSignerKey.getBytes()))) {
                throw new RuntimeException("JWT signature verification failed");
            }
            return signedJWT.getJWTClaimsSet();
        } catch (ParseException | JOSEException exception) {
            throw new RuntimeException(exception);
        }
    }

    private String extractJwtId(String token) {
        return extractAllClams(token).getJWTID();
    }
}
