package dev.chinhcd.backend.dtos.response.duclm;

import java.sql.Time;

public record TestResultResponse(
        String testName,
        Integer attempts,
        Integer score,
        Time timeSpent,
        String status
) {
}
