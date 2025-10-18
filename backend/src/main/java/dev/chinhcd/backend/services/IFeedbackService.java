package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.FeedbackRequest;

public interface IFeedbackService {

    Boolean sendFeedback(FeedbackRequest feedbackRequest);
}
