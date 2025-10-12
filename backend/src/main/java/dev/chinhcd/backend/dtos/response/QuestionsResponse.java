package dev.chinhcd.backend.dtos.response;

import lombok.Builder;

@Builder
public record QuestionsResponse(
        Integer questionId,
        String questionText,
        String choice1,
        String choice2,
        String choice3,
        String choice4,
        byte[] audioFile
) {

}
