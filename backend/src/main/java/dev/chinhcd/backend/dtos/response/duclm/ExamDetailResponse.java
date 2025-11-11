package dev.chinhcd.backend.dtos.response.duclm;

import java.util.List;

public record ExamDetailResponse(
        Long examId,
        String examName,
        String examStart,
        String examEnd,
        int grade,
        String status,
        List<QuestionDetailResponse> questions
) {}
