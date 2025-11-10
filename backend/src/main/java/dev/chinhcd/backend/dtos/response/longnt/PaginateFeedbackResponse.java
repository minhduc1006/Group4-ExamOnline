package dev.chinhcd.backend.dtos.response.longnt;

import java.util.List;

public record PaginateFeedbackResponse(
        List<UserFeedbackResponse> userFeedbackResponses,
        int totalPages,
        long totalItems,
        int currentPage,
        int pageSize,
        Double averageScore
) {
}