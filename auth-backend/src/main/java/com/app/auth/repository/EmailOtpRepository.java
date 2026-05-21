package com.app.auth.repository;

import com.app.auth.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findFirstByEmailOrderByCreatedAtDesc(String email);

    long countByEmailAndCreatedAtAfter(String email, LocalDateTime since);

    @Modifying
    @Query("""
        UPDATE EmailOtp o
        SET o.used = true, o.verified = false
        WHERE o.email = :email
    """)
    void invalidatePreviousOtps(@Param("email") String email);
}
