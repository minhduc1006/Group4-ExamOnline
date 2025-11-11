package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.models.duclm.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IExamQuestionRepository extends JpaRepository<ExamQuestion, Integer> {
    void deleteByExam(Exam exam);

    List<ExamQuestion> findByExam(Exam exam);
}
