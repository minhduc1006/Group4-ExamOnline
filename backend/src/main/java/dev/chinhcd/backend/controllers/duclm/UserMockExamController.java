package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.UserMockExam;
import dev.chinhcd.backend.services.duclm.IUserMockExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-mock-exam")
@RequiredArgsConstructor
public class UserMockExamController {

    private final IUserMockExamService userMockExamService;


    @GetMapping("/latest/{userId}")
    public UserMockExam getLatestUserMockExam(@PathVariable Long userId) {
        return userMockExamService.getMostRecentMockExam(userId);
    }
    @GetMapping("/getall/{userId}")
    public List<UserMockExam> getAggregatedResults(@PathVariable Long userId) {
        return userMockExamService.getAggregatedResults(userId);
    }

}
