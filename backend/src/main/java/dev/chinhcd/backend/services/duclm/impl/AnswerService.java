package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.repository.duclm.IAnswerRepository;
import dev.chinhcd.backend.services.duclm.IAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerService implements IAnswerService {

    private final IAnswerRepository answerRepository;

    @Override
    public boolean isAnswerCorrect(String answer, Integer id) {
        return (answerRepository.findByQuestion_QuestionId(id).getCorrectAnswer().equals(answer));
    }
}
