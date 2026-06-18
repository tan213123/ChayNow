package com.teamg5.be.config;

import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@chaynow.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(AccountStatus.ACTIVE)
                    .phone("0123456789")
                    .build();
            userRepository.save(admin);
            log.info("Successfully created default administrator account: {}", adminEmail);
        } else {
            log.info("Administrator account {} already exists.", adminEmail);
        }
    }
}
