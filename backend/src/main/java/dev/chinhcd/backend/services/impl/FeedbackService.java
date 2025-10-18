package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.FeedbackRequest;
import dev.chinhcd.backend.models.Feedback;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IFeedbackRepository;
import dev.chinhcd.backend.services.IFeedbackService;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackService implements IFeedbackService {
    private final IFeedbackRepository feedbackRepository;
    private final IUserService userService;

    @Override
    public Boolean sendFeedback(FeedbackRequest feedbackRequest) {
        User user = userService.getUserById(feedbackRequest.userId());
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setRating(feedbackRequest.rating());
        feedback.setComment(feedbackRequest.comment());
        feedbackRepository.save(feedback);
        return true;
    }

}
