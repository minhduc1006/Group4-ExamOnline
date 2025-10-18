package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.ExamQuestion;
import dev.chinhcd.backend.models.duclm.MockExam;
import dev.chinhcd.backend.models.duclm.MockExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMockExamQuestionRepository extends JpaRepository<MockExamQuestion, Integer> {
    List<MockExamQuestion> findByMockExam(MockExam mockExam);
}
