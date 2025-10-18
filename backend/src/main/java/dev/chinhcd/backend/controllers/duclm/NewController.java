package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.New;
import dev.chinhcd.backend.services.duclm.impl.NewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewController {

    private final NewService newService;

    @GetMapping("/latest")
    public ResponseEntity<List<New>> getLatestNews() {
        return ResponseEntity.ok(newService.getThreeNews());
    }
}
