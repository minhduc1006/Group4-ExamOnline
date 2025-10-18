package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRefreshTokenRepository extends JpaRepository<RefreshToken, String> {
}
