package com.app.auth;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class AuthApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(AuthApplication.class);
        application.setDefaultProperties(loadDotenvDefaults());
        application.run(args);
    }

    private static Map<String, Object> loadDotenvDefaults() {
        Map<String, Object> defaults = new HashMap<>();
        Path[] candidates = new Path[]{
            Path.of(".env"),
            Path.of("auth-backend", ".env")
        };

        for (Path candidate : candidates) {
            if (!Files.exists(candidate)) {
                continue;
            }

            Dotenv dotenv = Dotenv.configure()
                .directory(candidate.getParent() == null ? "." : candidate.getParent().toString())
                .filename(candidate.getFileName().toString())
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

            dotenv.entries().forEach(entry -> defaults.putIfAbsent(entry.getKey(), entry.getValue()));
            break;
        }

        return defaults;
    }
}
