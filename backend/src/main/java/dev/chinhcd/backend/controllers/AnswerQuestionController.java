package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.duclm.TimeRequest;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import dev.chinhcd.backend.models.duclm.TestResult;
import dev.chinhcd.backend.services.IExamService;
import dev.chinhcd.backend.services.duclm.IMockExamService;
import dev.chinhcd.backend.services.duclm.impl.AnswerService;
import dev.chinhcd.backend.services.duclm.impl.TestResultService;
import dev.chinhcd.backend.services.duclm.impl.UserExamService;
import dev.chinhcd.backend.services.duclm.impl.UserMockExamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Time;
import java.time.LocalTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AnswerQuestionController {
    private final SimpMessagingTemplate messagingTemplate;
    private final IExamService examService;
    private final Map<String, Integer> userScores = new ConcurrentHashMap<>();
    private final AnswerService answerService;
    private final TestResultService testResultService;
    private final IMockExamService mockExamService;
    private final UserExamService userExamService;
    private final UserMockExamService userMockExamService;

    @MessageMapping("/register")
    public void registerUser(@Payload String username, SimpMessageHeaderAccessor headerAccessor) {
    }

    @SendToUser("/queue/total-score")
    @MessageMapping("/answer")
    public String receiveAnswer(@Payload String answer, SimpMessageHeaderAccessor headerAccessor) {
        // Xử lý đáp án
        String result = answer.equalsIgnoreCase("A") ? "Đúng" : "Sai";

        return result;
    }

    @SendToUser("/queue/final-result")
    @MessageMapping("/final-result")
    public Double getFinalResult(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String[] parts = message.split("-", 3);
        Long uexamId = Long.parseLong(parts[0]);
        Long time = Long.parseLong(parts[1]);
        String type = parts[2];
        if (type.equals("exam")) {
            return userExamService.getScore(uexamId, time);
        } else {
            return userMockExamService.getScores(uexamId, time);
        }
    }

    @MessageMapping("/answer/exam")
    public void answerExam(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String[] parts = message.split("-", 3);
        Integer questionId = Integer.parseInt(parts[0]);
        Long uexamId = Long.parseLong(parts[1]);
        String answer = parts[2];
        // Xử lý đáp án
        examService.answerQuestion(questionId, uexamId, answer);
    }

    @MessageMapping("/answer/mock-exam")
    public void answerMockExam(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String[] parts = message.split("-", 3);
        Integer questionId = Integer.parseInt(parts[0]);
        Long uexamId = Long.parseLong(parts[1]);
        String answer = parts[2];
        // Xử lý đáp án
        mockExamService.answerQuestion(questionId, uexamId, answer);
    }

    @SendToUser("/queue/exam-id")
    @MessageMapping("/start-exam")
    public Long startExam(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        String[] parts = message.split("-", 3);
        Long userId = Long.parseLong(parts[0]);
        Long examId = Long.parseLong(parts[1]);
        String type = parts[2];

        if (type.equals("exam")) {
            return userExamService.addUserExam(userId, examId);
        } else {
            return userMockExamService.addUserMockExam(userId, examId);
        }
    }

    @MessageMapping("/reset-score")
    @SendToUser("/queue/practice/reset")
    public void resetUserScore(@Payload String userId) {
        userScores.put(userId, 0);
        log.info("User {} has reset their score.", userId);
    }


    @SendToUser("/queue/practice/total-score")
    @MessageMapping("/submit-answer")
    public String receivePracticeAnswer(@Payload String data, SimpMessageHeaderAccessor headerAccessor) {
        // Tách dữ liệu từ payload
        String[] parts = data.split("\\*");
        if (parts.length != 3) return null;

        String userChoice = parts[0]; // Đáp án của người dùng
        Integer questionId = Integer.parseInt(parts[1]); // ID câu hỏi
        String userId = parts[2]; // ID người dùng


        // Kiểm tra đáp án
        boolean isCorrect = answerService.isAnswerCorrect(userChoice, questionId);

        // Cập nhật điểm nếu đúng
        userScores.putIfAbsent(userId, 0);
        if (isCorrect) {
            userScores.put(userId, userScores.get(userId) + 10);
        }

        int newScore = userScores.get(userId);
        log.info("User {} answered: {}, Correct: {}, New Score: {}",
                userId, userChoice, isCorrect, newScore);

        // Gửi điểm mới về FE
        messagingTemplate.convertAndSendToUser(userId, "/queue/practice/total-score", newScore);
        return newScore + "*" + isCorrect;
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/save-time")
    public ResponseEntity<Void> saveTime(@RequestBody TimeRequest timeRequest) {
        int timeTaken = timeRequest.timeTaken();
        LocalTime localTime = LocalTime.ofSecondOfDay(timeTaken);
        Time timeSpent = Time.valueOf(localTime);

        // Lưu kết quả vào cơ sở dữ liệu
        TestResult testResult = new TestResult();
        User user = new User();
        user.setId(timeRequest.userID());
        SmallPractice smallPractice = new SmallPractice();
        smallPractice.setSmallPracticeId(timeRequest.smallpracticeID());

        Integer newScore = userScores.get(timeRequest.userID().toString());

        testResult.setScore(newScore);
        testResult.setUser(user);
        testResult.setSmallPractice(smallPractice);
        testResult.setTimeSpent(timeSpent);
        testResult.setAttempts(1);

        testResultService.saveTestResult(testResult);

        return ResponseEntity.ok().build();
    }

}
