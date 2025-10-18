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
            "JOIN SmallPracticeQuestion spq ON q.id = spq.question.id " +
            "JOIN SmallPractice sp ON spq.smallPractice.id = sp.id " +
            "WHERE sp.practice.id = :practiceId")
    List<Question> findByPracticeId(@Param("practiceId") Long practiceId);

    @Query("SELECT q FROM Question q " +
            "JOIN ExamQuestion spq ON q.id = spq.question.id " +
            "WHERE spq.exam.id = :examId")
    List<Question> findByExamId(@Param("examId") Long examId);

    @Query("SELECT q FROM Question q " +
            "JOIN MockExamQuestion spq ON q.id = spq.question.id " +
            "WHERE spq.mockExam.id = :mockExamId")
    List<Question> findByMockExamId(Long mockExamId);
}
