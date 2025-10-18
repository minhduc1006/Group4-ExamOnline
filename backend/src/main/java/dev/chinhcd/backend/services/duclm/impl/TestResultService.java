package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.dtos.response.duclm.TestResultResponse;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import dev.chinhcd.backend.models.duclm.TestResult;
import dev.chinhcd.backend.repository.duclm.ISmallPracticeRepository;
import dev.chinhcd.backend.repository.duclm.ITestResultRepository;
import dev.chinhcd.backend.services.duclm.ITestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestResultService implements ITestResultService {
    private final ITestResultRepository testResultRepository;

    private final ISmallPracticeRepository smallPracticeRepository;

    @Override
    public List<TestResultResponse> getTestResults(Long userId, Integer currentLevel) {
        // Lấy danh sách bài thi từ bảng small_practice theo currentLevel
        List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice_PracticeId(currentLevel);

        // Duyệt qua từng bài thi và kiểm tra kết quả thi của người dùng
        return smallPractices.stream().map(practice -> {
            // Kiểm tra kết quả thi trong bảng test_results
            var testResultOpt = testResultRepository.findByUserIdAndSmallPractice_SmallPracticeId(userId, practice.getSmallPracticeId());
            if (testResultOpt.isPresent()) {
                TestResult testResult = testResultOpt.get();
                return new TestResultResponse(
                        practice.getTestName(),
                        testResult.getAttempts(),
                        testResult.getScore(),
                        testResult.getTimeSpent(),
                        practice.getTestName() + " Hoàn Thành"
                );
            } else {
                return new TestResultResponse(
                        practice.getTestName(),
                        0,  // attempts
                        0,  // score
                        Time.valueOf("00:00:00"),  // timeSpent
                        "Chưa thi"
                );
            }
        }).collect(Collectors.toList());
    }
}
