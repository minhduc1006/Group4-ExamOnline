package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.services.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${frontend.url}")
    private String appUrl;

    @Async("taskExecutor")
    public void sendVerificationEmail(String to, String subject, String content, String token, String url, Long id) {
        try{
            String verifyLink = appUrl + url + "?id=" + id + "&email=" + to + "&token=" + token;

            Context context = new Context();
            context.setVariable("verifyLink", verifyLink);
            context.setVariable("content", content);

            String emailContent = templateEngine.process("email_verification", context);

            sendEmail(to, subject, emailContent);
        } catch (Exception e) {
        }
    }

    @Override
    @Async("taskExecutor")
    public void sendMail(String to, String subject, String content) {
        sendEmail(to, subject, content);
    }

    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi gửi email", e);
        }
    }
}
