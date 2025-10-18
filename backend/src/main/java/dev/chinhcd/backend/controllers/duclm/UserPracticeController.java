package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.dtos.response.duclm.PracticeLevelReportResponse;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.UserPractice;
import dev.chinhcd.backend.repository.IUserRepository;
import dev.chinhcd.backend.repository.duclm.IPracticeRepository;
import dev.chinhcd.backend.repository.duclm.IUserPracticeRepository;
import dev.chinhcd.backend.services.duclm.impl.UserPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.List;

@RestController
@RequestMapping("/practice")
@RequiredArgsConstructor
public class UserPracticeController {

    private final UserPracticeService userPracticeService;
    private final IUserPracticeRepository userPracticeRespository;
    private final IPracticeRepository practiceRepository;
    private final IUserRepository userRepository;

    @GetMapping("/get-practice-info/{id}")
    public ResponseEntity<Long> getPracticeInfo(@PathVariable Long id) {
        Integer practiceId = userPracticeService.getPracticeInfoByUserId(id);

        if (practiceId == null) {
            UserPractice userPractice = new UserPractice();
            User user = userRepository.findById(id).get();
            Practice practice = practiceRepository.findByPracticeLevelAndGrade(1, user.getGrade()).get();
            userPractice.setUser(user);
            userPractice.setPractice(practice);
            userPractice.setTotalScore(0);
            userPractice.setTotalTime(Time.valueOf("00:00:00"));
            userPracticeRespository.save(userPractice);
            return getPracticeInfo(id);
        }
        int level = practiceRepository.findById(Long.valueOf(practiceId)).get().getPracticeLevel();

        return ResponseEntity.ok((long) level);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<PracticeLevelReportResponse>> getPracticeStats() {
        List<PracticeLevelReportResponse> stats = userPracticeRespository.getUserCountByLevel();
        return ResponseEntity.ok(stats);
    }




}
