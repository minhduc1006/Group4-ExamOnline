package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.dtos.response.duclm.TestResultResponse;
import dev.chinhcd.backend.models.duclm.TestResult;

import java.util.List;

public interface ITestResultService {
    List<TestResultResponse> getTestResults(Long userID, Integer currentLevel);
    void saveTestResult(TestResult testResult);
    boolean deleteTestResultsByLevelAndUserId(Integer level, Long userId);
}
