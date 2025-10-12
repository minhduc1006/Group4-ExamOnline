package dev.chinhcd.backend.dtos.request;

public record AnswerQuestionRequest(
        Long userId,
        Long examId,
        Long questionId,
        String answer
) {
}
