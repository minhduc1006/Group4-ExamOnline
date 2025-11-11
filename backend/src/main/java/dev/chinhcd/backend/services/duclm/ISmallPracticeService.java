package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.Question;

import java.util.List;

public interface ISmallPracticeService {
    List<Question> getQuestionsBySmallPracticeId(Long smallPracticeId);
}
