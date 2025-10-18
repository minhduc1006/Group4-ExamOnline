package dev.chinhcd.backend.dtos.response.duclm;

import dev.chinhcd.backend.models.duclm.Practice;

import java.util.List;

public record PracticeDetailResponse(Practice practice, List<SmallPracticeDetailResponse> practiceDetails) {
}