package dev.chinhcd.backend.dtos.response.longnt;

import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.models.duclm.Practice;

import java.util.List;

public record ScheduleResponse(
        List<Practice> practices,
        List<Exam> exams
) {
}
