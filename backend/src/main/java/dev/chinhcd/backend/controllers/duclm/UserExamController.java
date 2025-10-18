package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.UserExam;
import dev.chinhcd.backend.services.duclm.impl.UserExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user-exam")
@RequiredArgsConstructor
public class UserExamController {
    private final UserExamService userExamService;

    @GetMapping("/get-result/{userId}")
    public Optional<UserExam> getUserExamResult(@PathVariable Long userId, @RequestParam String examName) {
        return userExamService.getUserExamResult(userId, examName);
    }

    @GetMapping("/get-users/{limit}")
    public ResponseEntity<List<UserExam>> getTop200Users(@RequestParam String examName, @PathVariable Integer limit) {
        List<UserExam> users = userExamService.getUserExamList(examName, limit);
        return ResponseEntity.ok(users);
    }

}