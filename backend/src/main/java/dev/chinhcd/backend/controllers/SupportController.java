package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.SupportRequestRequest;
import dev.chinhcd.backend.services.ISupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/support")
public class SupportController {
    private final ISupportService supportService;

    @PostMapping("/send-request")
    public ResponseEntity<Boolean> sendRequest(@RequestBody SupportRequestRequest request) {
        return ResponseEntity.ok(supportService.sendSupportRequest(request));
    }
}
