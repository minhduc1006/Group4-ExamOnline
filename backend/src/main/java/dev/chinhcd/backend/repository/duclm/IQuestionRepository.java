package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IQuestionRepository extends JpaRepository<Question, Integer> {

    @Query("SELECT q FROM Question q " +
            "JOIN SmallPracticeQuestion spq ON q.questionId = spq.question.questionId " +
            "JOIN SmallPractice sp ON spq.smallPractice.smallPracticeId = sp.smallPracticeId " +
            "WHERE sp.practice.practiceId = :practiceId")
    List<Question> findByPracticeId(@Param("practiceId") Long practiceId);

    @Query("SELECT q FROM Question q " +
            "JOIN ExamQuestion spq ON q.questionId = spq.question.questionId " +
            "WHERE spq.exam.examId = :examId")
    List<Question> findByExamId(@Param("examId") Long examId);

    @Query("SELECT q FROM Question q " +
            "JOIN MockExamQuestion spq ON q.questionId = spq.question.questionId " +
            "WHERE spq.mockExam.mockExamId = :mockExamId")
    List<Question> findByMockExamId(Long mockExamId);
}
