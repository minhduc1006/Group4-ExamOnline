package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.dtos.response.duclm.TestResultResponse;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import dev.chinhcd.backend.models.duclm.TestResult;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.repository.duclm.ISmallPracticeRepository;
import dev.chinhcd.backend.repository.duclm.ITestResultRepository;
import dev.chinhcd.backend.services.duclm.ITestResultService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestResultService implements ITestResultService {

    private final ITestResultRepository testResultRepository;
    private final IUserRepository userRepository;
    private final ISmallPracticeRepository smallPracticeRepository;

    @Override
    public void saveTestResult(TestResult testResult) {
        testResultRepository.save(testResult);
    }

    @Override
    @Transactional
    public boolean deleteTestResultsByLevelAndUserId(Integer level, Long userId) {
        try {
            // Kiểm tra xem user có tồn tại không
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found with ID: " + userId);
            }
            User user = userOpt.get();

            // Lấy danh sách SmallPractice theo level và grade của user
            List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice_PracticeLevelAndPractice_Grade(level, user.getGrade());
            if (smallPractices.isEmpty()) {
                throw new RuntimeException("No SmallPractice found for level: " + level + " and user grade: " + user.getGrade());
            }

            boolean deleted = false;
            for (SmallPractice smallPractice : smallPractices) {
                Integer deletedCount = testResultRepository.deleteBySmallPractice_SmallPracticeIdAndUser(smallPractice.getSmallPracticeId(), userId);
                if (deletedCount > 0) {
                    deleted = true;
                }
            }

            return deleted;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting test results", e);
        }
    }


    @Override
    public List<TestResultResponse> getTestResults(Long userID, Integer currentLevel) {
        User user = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userID));


        // Lấy danh sách bài thi từ bảng small_practice theo currentLevel
        List<SmallPractice> smallPractices = smallPracticeRepository.findByPractice_PracticeLevelAndPractice_Grade(currentLevel, user.getGrade());

        // Duyệt qua từng bài thi và kiểm tra kết quả thi của người dùng
        return smallPractices.stream().map(practice -> {
            // Kiểm tra kết quả thi trong bảng test_results
            var testResultOpt = testResultRepository.findByUserIdAndSmallPractice_SmallPracticeId(user.getId(), practice.getSmallPracticeId());
            if (testResultOpt.isPresent()) {
                TestResult testResult = testResultOpt.get();
                return new TestResultResponse(
                        practice.getSmallPracticeId(),
                        practice.getTestName(),
                        testResult.getAttempts(),
                        testResult.getScore(),
                        testResult.getTimeSpent(),
                        "Hoàn thành"
                );
            } else {
                return new TestResultResponse(practice.getSmallPracticeId(),
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
