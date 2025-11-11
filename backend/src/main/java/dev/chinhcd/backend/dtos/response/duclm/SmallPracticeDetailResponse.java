package dev.chinhcd.backend.dtos.response.duclm;

import java.util.List;

public record SmallPracticeDetailResponse(String testName, List<QuestionDetailResponse> questions) {

}
