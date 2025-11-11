package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Answer;
import dev.chinhcd.backend.models.duclm.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface IAnswerRepository extends JpaRepository<Answer, Integer> {
    Answer findByQuestion(Question question);

    @Query("SELECT a from Answer a where a.question.questionId=:questionId")
    Answer findByQuestionId(Integer questionId);

    Answer findByQuestion_QuestionId(Integer questionId);
}
