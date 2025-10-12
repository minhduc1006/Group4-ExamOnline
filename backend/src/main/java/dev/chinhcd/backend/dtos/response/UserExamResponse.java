package dev.chinhcd.backend.dtos.response;

import java.sql.Time;

public record UserExamResponse(
        String examName,
        Double score,
        Time totalTime
) {
}
