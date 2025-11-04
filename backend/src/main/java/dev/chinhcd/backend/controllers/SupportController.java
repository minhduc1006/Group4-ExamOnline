package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.NewSupportAnswer;
import dev.chinhcd.backend.dtos.request.SupportRequestRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateSupportResponse;
import dev.chinhcd.backend.dtos.response.longnt.PaginateSupportUser;
import dev.chinhcd.backend.services.ISupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/support")
public class SupportController {
    private final ISupportService supportService;

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/send-request")
    public ResponseEntity<Boolean> sendRequest(@RequestBody SupportRequestRequest request) {
        return ResponseEntity.ok(supportService.sendSupportRequest(request));
    }

    @GetMapping("/requests")
    public ResponseEntity<PaginateSupportResponse> getSupportRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String issueCategory,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        PaginateSupportResponse response = supportService.getSupportRequestsFiltered(status, issueCategory, page, pageSize);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests/{id}/answer")
    public ResponseEntity<String> getSupportAnswer(@PathVariable Long id) {
        String answer = supportService.getSupportAnswer(id);
        return ResponseEntity.ok(answer);
    }

    @PostMapping("/requests/{id}/answer")
    public ResponseEntity<Map<String, String>> updateSupportAnswer(
            @PathVariable Long id,
            @RequestBody NewSupportAnswer newAnswer) {
        Boolean result = supportService.updateSupportAnswerAndStatus(id, newAnswer.newAnswer());
        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("newAnswer", newAnswer.newAnswer());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Yêu cầu hỗ trợ không tồn tại!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/user/requests")
    public ResponseEntity<PaginateSupportUser> getSupportRequestsByUser(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        PaginateSupportUser response = supportService.getSupportRequestsByUserId(userId, page, pageSize);
        return ResponseEntity.ok(response);
    }
}

