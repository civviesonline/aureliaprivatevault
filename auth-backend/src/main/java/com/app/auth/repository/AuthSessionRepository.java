package com.app.auth.repository;

import com.app.auth.entity.AuthSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, Long> {

    Optional<AuthSession> findByTokenHash(String tokenHash);

    @Modifying
    void deleteByTokenHash(String tokenHash);

    @Modifying
    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}
