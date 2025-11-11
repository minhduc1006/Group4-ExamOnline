package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.Question;
import dev.chinhcd.backend.services.duclm.impl.SmallPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/small-practice")
@RequiredArgsConstructor
public class SmallPracticeController {
    private final SmallPracticeService smallPracticeService;

    @GetMapping("/{smallPracticeId}/questions")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable Long smallPracticeId) {
        return ResponseEntity.ok(smallPracticeService.getQuestionsBySmallPracticeId(smallPracticeId));
    }
}

