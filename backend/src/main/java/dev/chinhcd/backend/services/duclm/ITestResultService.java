package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.dtos.response.duclm.TestResultResponse;

import java.util.List;

public interface ITestResultService {
    List<TestResultResponse> getTestResults(Long userId, Integer currentLevel);
}
