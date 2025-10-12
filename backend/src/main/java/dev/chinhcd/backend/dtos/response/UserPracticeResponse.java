package dev.chinhcd.backend.dtos.response;

import java.sql.Time;

public record UserPracticeResponse(
        String practiceLevel,
        Double score,
        Time totalTime
) {

}
