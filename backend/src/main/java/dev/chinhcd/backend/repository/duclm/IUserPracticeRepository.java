package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.dtos.response.duclm.PracticeLevelReportResponse;
import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.UserPractice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT MAX(p.practiceLevel) FROM UserPractice up JOIN up.practice p WHERE up.user.id = :userId")
    Optional<Integer> findMaxPracticeLevelByUserId(@Param("userId") Long userId);


    List<UserPractice> findAllByUserId(Long userId);

    Optional<UserPractice> findFirstByUserId(Long userId);

    List<UserPractice> findAllByUserIdAndPractice_PracticeLevel(Long userId, Integer practiceLevel);

    List<UserPractice> findByPractice(Practice practice);
    @Query(value = """
                SELECT * FROM (
                                  SELECT up.*, ROW_NUMBER() OVER (
                                      PARTITION BY p.practice_level
                                      ORDER BY up.total_score DESC, up.total_time ASC, up.id ASC
                                      ) AS rnk
                                  FROM user_practice up
                                           JOIN practice p ON up.practice_id = p.practice_id
                                  WHERE up.user_id = :userId AND p.grade = :grade
                              ) ranked
                WHERE rnk = 1
            """, nativeQuery = true)
    List<UserPractice> findBestPracticeByUserAndGrade(@Param("userId") Long userId, @Param("grade") int grade);

    @Query(value = """
                SELECT SUM(DATEDIFF(SECOND, CAST('00:00:00' AS TIME), ue.total_time))
                FROM user_practice ue
                JOIN practice e ON ue.practice_id = e.practice_id
                WHERE ue.user_id = :userId AND e.grade = :grade;
            """, nativeQuery = true)
    Long getTotalPracticeTime(@Param("userId") Long userId, @Param("grade") int grade);
}
