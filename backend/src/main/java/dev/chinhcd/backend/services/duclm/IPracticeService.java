package dev.chinhcd.backend.services.duclm;

public interface IPracticeService {
    Integer getMaxLevel();

    boolean isUserCompleted(Long userId);
}
