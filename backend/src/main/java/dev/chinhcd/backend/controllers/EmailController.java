package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.services.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mail")
public class EmailController {
    private final IEmailService emailService;

    @GetMapping("/send")
    public void sendMail(@RequestParam String email, @RequestParam String subject, @RequestParam String content) {
        emailService.sendVerificationEmail(email, "Yêu cầu thêm email", "thêm email", "token", "url", 2L);
    }

}
