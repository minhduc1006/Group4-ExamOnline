package dev.chinhcd.backend.dtos.response.longnt;

public record UserFeedbackResponse(
        String username,
        Long id,
        Integer rating,
        String comment
) {
}
