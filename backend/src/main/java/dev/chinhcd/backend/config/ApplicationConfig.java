package dev.chinhcd.backend.config;

import dev.chinhcd.backend.enums.AccountType;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public ApplicationRunner applicationRunner(IUserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                var admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder().encode("admin"));
                admin.setRole(Role.ADMIN);
                admin.setIsDoingExam(false);
                admin.setAccountType(AccountType.FREE_COURSE);
                admin.setIsLocked(false);

                userRepository.save(admin);
                log.info("Admin has been created: {}", admin.getUsername());
            }
        };
    }
}
