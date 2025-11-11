package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.duclm.MockExam;
import dev.chinhcd.backend.models.duclm.UserMockExam;
import dev.chinhcd.backend.repository.duclm.IMockExamRepository;
import dev.chinhcd.backend.repository.duclm.IUserMockExamRepository;
import dev.chinhcd.backend.services.duclm.IAnswerService;
import dev.chinhcd.backend.services.duclm.IMockExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MockExamService implements IMockExamService {

    private final IMockExamRepository mockExamRepository;
    private final IUserMockExamRepository userMockExamRepository;
    private final IAnswerService answerService;

    @Override
    public List<MockExam> getMockExams(String grade) {
        return mockExamRepository.findAllByGrade(grade);
    }

    @Override
    public void answerQuestion(Integer questionId, Long uexamId, String answer) {
        boolean isCorrect = answerService.isAnswerCorrect(answer, questionId);
        if(!isCorrect) {
            return;
        }

        UserMockExam ue = userMockExamRepository.findByUserMockExamId(uexamId).orElse(null);
        ue.setScore(ue.getScore() + 10);
        userMockExamRepository.save(ue);
    }
}
