package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.MockExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IMockExamRepository extends JpaRepository<MockExam, Integer> {
    Optional<Object> findByExamNameAndGrade(String examName, String grade);
}
