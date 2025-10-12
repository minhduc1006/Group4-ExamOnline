package dev.chinhcd.backend.dtos.response;

import java.util.List;

public record AchievementResponse(
        List<UserExamResponse> exam,
        List<UserExamResponse> mockExam,
        List<UserPracticeResponse> practice,
        Long totalTimeExam,
        Long totalTimeMockExam,
        Long totalTimePractice
) {
}
