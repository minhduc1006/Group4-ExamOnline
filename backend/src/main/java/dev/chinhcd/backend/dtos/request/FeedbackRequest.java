package dev.chinhcd.backend.dtos.request;

public record FeedbackRequest(
        Long userId,
        Integer rating,
        String comment
) {
}
