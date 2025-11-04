package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.classDTO.EmailInforDTO;
import dev.chinhcd.backend.dtos.request.classDTO.UserInforDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {
    private final IEmailService emailService;

    @KafkaListener(topics = "email", groupId = "email-group")
    public Boolean sendVerificationAddEmail(EmailInforDTO e) {
        try {
            emailService.sendVerificationEmail(e.getTo(), e.getSubject(), e.getContent(), e.getToken(), e.getUrlPathFrontEnd(), e.getId());
        } catch (RuntimeException ignored) {
        }
        return true;
    }

    @KafkaListener(topics = "admin-create-account", groupId = "email-group")
    public Boolean sendMailAccountInfor(UserInforDTO u) {
        try {
            String subject = "Mail tạo tài khoản";
            String content = "Tài khoản mới của bạn là: tài khoản: " + u.getUsername() + ", mật khẩu: " + u.getPassword();
            emailService.sendMail(u.getEmail(), subject, content);
        } catch (RuntimeException ignored) {
        }
        return true;
    }

}
