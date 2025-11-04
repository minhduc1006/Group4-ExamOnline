package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.FeedbackRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateFeedbackResponse;

public interface IFeedbackService {

    Boolean sendFeedback(FeedbackRequest feedbackRequest);

    PaginateFeedbackResponse getPaginatedFeedbacks(int page, int pageSize, String username, Integer rating);
}
