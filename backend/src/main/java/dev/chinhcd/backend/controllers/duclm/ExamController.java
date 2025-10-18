package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.services.duclm.IExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
public class ExamController {

    private final IExamService examService;

    @GetMapping("/max-level")
    public ResponseEntity<Integer> getMaxLevel() {
        return ResponseEntity.ok(examService.getMaxLevel());
    }
}
