package dev.chinhcd.backend.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

    @Bean
    NewTopic email() {
        return new NewTopic("email", 1, (short) 1);
    }

    @Bean
    NewTopic adminCreateAccount() {
        return new NewTopic("admin-create-account", 1, (short) 1);
    }
}
