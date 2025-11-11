package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IExamRepository extends JpaRepository<Exam, Long> {
    @Query("SELECT e FROM Exam e WHERE e.status = 'on' ORDER BY e.examStart ASC LIMIT 1")
    Exam findNextExam();

    Optional<Object> findByExamNameAndGrade(String examName, int grade);

     @Query("SELECT e FROM Exam e WHERE e.examName = :examName ORDER BY e.examStart ASC")
    List<Exam> getExamsByExamName(String examName);
}

