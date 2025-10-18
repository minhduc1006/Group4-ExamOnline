package dev.chinhcd.backend.dtos.response.duclm;

import java.util.List;

public record MockExamDetailResponse(
        Long examId,
        String examName,
        String examDate,
        int grade,
        String type,
        List<QuestionDetailResponse> questions
) {}
