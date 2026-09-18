package com.example.spikenews.config;

import com.example.spikenews.model.User;
import com.example.spikenews.model.enums.Role;
import com.example.spikenews.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@spikenews.com").isEmpty()) {
                User admin = User.builder()
                        .nome("Administrador Spike News")
                        .email("admin@spikenews.com")
                        .senhaHash(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
            }
        };
    }
}

