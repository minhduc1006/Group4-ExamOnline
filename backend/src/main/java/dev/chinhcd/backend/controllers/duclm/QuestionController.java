package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.Question;
import dev.chinhcd.backend.repository.duclm.IQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/question")
@RequiredArgsConstructor
public class QuestionController {

    private final IQuestionRepository questionRepository;

    @GetMapping("/{id}")
    public ResponseEntity<ByteArrayResource> getAudioFile(@PathVariable int id) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if (questionOpt.isPresent()) {
            Question question = questionOpt.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                    .body(new ByteArrayResource(question.getAudioFile()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
