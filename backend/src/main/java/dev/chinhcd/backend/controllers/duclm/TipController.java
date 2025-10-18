package dev.chinhcd.backend.controllers.duclm;

import dev.chinhcd.backend.models.duclm.New;
import dev.chinhcd.backend.models.duclm.Tip;
import dev.chinhcd.backend.services.duclm.impl.NewService;
import dev.chinhcd.backend.services.duclm.impl.TipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tips")
@RequiredArgsConstructor
public class TipController {

    private final TipService tipService;

    @GetMapping("/latest")
    public ResponseEntity<List<Tip>> getLatestNews() {
        return ResponseEntity.ok(tipService.getThreeTips());
    }
}
