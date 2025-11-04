package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.FeedbackRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateFeedbackResponse;
import dev.chinhcd.backend.services.IFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feedback")
public class FeedbackController {
    private final IFeedbackService feedbackService;

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/send")
    public ResponseEntity<Boolean> sendFeedback(@RequestBody FeedbackRequest feedback) {
        return ResponseEntity.ok(feedbackService.sendFeedback(feedback));
    }

    @GetMapping("/filtered")
    public ResponseEntity<PaginateFeedbackResponse> getFeedbacks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int pageSize,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Integer rating
    ) {
        PaginateFeedbackResponse response = feedbackService.getPaginatedFeedbacks(page, pageSize, username, rating);
        return ResponseEntity.ok(response);
    }

}
