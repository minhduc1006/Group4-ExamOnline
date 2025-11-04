package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.models.duclm.UserExam;
import dev.chinhcd.backend.repository.duclm.IAnswerRepository;
import dev.chinhcd.backend.repository.duclm.IUserExamRepository;
import dev.chinhcd.backend.services.IExamService;
import dev.chinhcd.backend.services.duclm.IAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamService implements IExamService {
    private final IAnswerRepository answerRepository;
    private final IUserExamRepository userExamRepository;
    private final IAnswerService answerService;

    @Override
    public void answerQuestion(Integer questionId, Long uexamId, String answer) {
        boolean isCorrect = answerService.isAnswerCorrect(answer, questionId);
        if(!isCorrect) {
            return;
        }
        UserExam ue = userExamRepository.findByUserExamId(uexamId).orElse(null);
        ue.setScore(ue.getScore() + 10);
        userExamRepository.save(ue);
    }
}
