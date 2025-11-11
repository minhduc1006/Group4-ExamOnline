package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Practice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPracticeRepository extends JpaRepository<Practice, Long>  {

    @Query("SELECT MAX(e.practiceLevel) FROM Practice e WHERE e.status = 'on'")
    Optional<Integer> findMaxLevel();

    Optional<Practice> findByPracticeLevelAndGradeAndStatus(int practiceLevel, int grade, String status);

    @Query("SELECT p FROM Practice p WHERE p.practiceLevel = :level ORDER BY p.practiceDate ASC")
    List<Practice> getPracticeByLevel(int level);

    Optional<Practice> findByPracticeLevelAndGrade(Integer practiceLevel, Integer grade);
}
