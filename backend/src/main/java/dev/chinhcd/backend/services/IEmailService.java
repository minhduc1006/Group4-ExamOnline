package dev.chinhcd.backend.services;

public interface IEmailService {
    void sendEmail(String to, String subject, String body);
    void sendMail(String to, String subject, String content);
    void sendVerificationEmail(String to, String subject, String content, String token, String url, Long id);
}
