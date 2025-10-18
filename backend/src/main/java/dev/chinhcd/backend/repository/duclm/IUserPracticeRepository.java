package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.dtos.response.duclm.PracticeLevelReportResponse;
import dev.chinhcd.backend.models.duclm.UserPractice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserPracticeRepository extends JpaRepository<UserPractice, Integer> {
    Optional<UserPractice> findByUserId(Long userId);

    @Query(value = "SELECT p.practice_level AS practiceLevel, COUNT(sp.user_id) AS userCount " +
            "FROM practice p " +
            "JOIN user_practice sp ON p.practice_id = sp.practice_id " +
            "GROUP BY p.practice_level " +
            "ORDER BY p.practice_level", nativeQuery = true)
    List<PracticeLevelReportResponse> getUserCountByLevel();
}
