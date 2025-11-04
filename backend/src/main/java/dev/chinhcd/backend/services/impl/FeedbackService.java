package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.FeedbackRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateFeedbackResponse;
import dev.chinhcd.backend.dtos.response.longnt.UserFeedbackResponse;
import dev.chinhcd.backend.models.Feedback;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IFeedbackRepository;
import dev.chinhcd.backend.services.IFeedbackService;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

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

    @Override
    public PaginateFeedbackResponse getPaginatedFeedbacks(int page, int pageSize, String username, Integer rating) {
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize);
        Page<Feedback> feedbackPage;
        if (rating != null && username != null) {
            feedbackPage = feedbackRepository.findByUserNameAndRating(username, rating, pageRequest);
        } else if (rating != null) {
            feedbackPage = feedbackRepository.findByRating(rating, pageRequest);
        } else if (username != null) {
            feedbackPage = feedbackRepository.findByUserName(username, pageRequest);
        } else {
            feedbackPage = feedbackRepository.findAll(pageRequest);
        }
        AtomicLong count = new AtomicLong(0);
        List<UserFeedbackResponse> uf = feedbackPage.getContent().stream().map(f -> {
            count.addAndGet(f.getRating());
            return new UserFeedbackResponse(f.getUser().getUsername(), f.getId(), f.getRating(), f.getComment());
        }).collect(Collectors.toList());
        Double avg = uf.isEmpty() ? 0.0 : (double) count.get() / uf.size();
        return new PaginateFeedbackResponse(
                uf,
                feedbackPage.getTotalPages(),
                feedbackPage.getTotalElements(),
                feedbackPage.getNumber() + 1,
                feedbackPage.getSize(),
                avg
        );
    }

}
