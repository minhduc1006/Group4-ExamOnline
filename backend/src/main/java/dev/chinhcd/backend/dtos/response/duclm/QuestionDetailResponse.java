package dev.chinhcd.backend.dtos.response.duclm;

import dev.chinhcd.backend.models.duclm.Answer;
import dev.chinhcd.backend.models.duclm.Question;

public record QuestionDetailResponse(Question question, Answer answer) {

}
