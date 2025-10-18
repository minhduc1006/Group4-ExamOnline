package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.TestResultResponse;
import dev.chinhcd.backend.services.duclm.ITestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test-results")
@RequiredArgsConstructor
public class TestResultController {

    private final ITestResultService testResultService;

    // Endpoint để lấy kết quả thi của người dùng theo userId và smallPracticeId
    @GetMapping("/get-test-results/{userId}/{currentLevel}")
    public ResponseEntity<List<TestResultResponse>> getTestResults(
            @PathVariable Long userId,
            @PathVariable Integer currentLevel) {
        try {
            List<TestResultResponse> result = testResultService.getTestResults(userId, currentLevel);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }
}

