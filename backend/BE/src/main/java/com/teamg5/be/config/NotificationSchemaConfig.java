package com.teamg5.be.config;

import com.teamg5.be.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationSchemaConfig implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            if (!notificationsTableExists()) {
                return;
            }

            String allowedTypes = Arrays.stream(NotificationType.values())
                    .map(Enum::name)
                    .map(value -> "'" + value.replace("'", "''") + "'")
                    .collect(Collectors.joining(", "));

            jdbcTemplate.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check");
            jdbcTemplate.execute("""
                    ALTER TABLE notifications
                    ADD CONSTRAINT notifications_type_check
                    CHECK (type IN (%s))
                    """.formatted(allowedTypes));

            log.info("Synchronized notifications_type_check constraint with NotificationType enum.");
        } catch (Exception ex) {
            log.warn("Could not synchronize notifications_type_check constraint.", ex);
        }
    }

    private boolean notificationsTableExists() {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE lower(table_name) = 'notifications'
                """,
                Integer.class
        );
        return count != null && count > 0;
    }
}
