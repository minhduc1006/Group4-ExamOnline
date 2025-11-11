package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.MockExam;

import java.util.List;

public interface IMockExamService {
    List<MockExam> getMockExams(String grade);

    void answerQuestion(Integer questionId, Long uexamId, String answer);
}
