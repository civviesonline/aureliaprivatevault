package com.app.auth.service;

import com.app.auth.entity.EmailOtp;
import com.app.auth.exception.AuthException;
import com.app.auth.repository.EmailOtpRepository;
import com.app.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom;

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.otp.rate-limit-max:3}")
    private int rateLimitMax;

    @Value("${app.otp.rate-limit-window-minutes:10}")
    private int rateLimitWindowMinutes;

    @Transactional
    public Map<String, Object> sendOtp(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw AuthException.emailAlreadyRegistered();
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusMinutes(rateLimitWindowMinutes);
        long recentRequestCount = emailOtpRepository.countByEmailAndCreatedAtAfter(email, since);
        if (recentRequestCount >= rateLimitMax) {
            throw AuthException.rateLimitExceeded();
        }

        emailOtpRepository.invalidatePreviousOtps(email);

        String otp = generateSixDigitOtp();
        EmailOtp emailOtp = EmailOtp.builder()
            .email(email)
            .otpHash(passwordEncoder.encode(otp))
            .expiresAt(now.plusMinutes(expiryMinutes))
            .attemptCount(0)
            .used(false)
            .verified(false)
            .build();

        emailOtpRepository.save(emailOtp);
        emailService.sendOtpEmail(email, deriveRecipientName(email), otp, expiryMinutes);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("email", email);
        response.put("expiresInMinutes", expiryMinutes);
        response.put("rateLimitWindowMinutes", rateLimitWindowMinutes);
        return response;
    }

    @Transactional
    public Map<String, Object> verifyOtp(String rawEmail, String otp) {
        String email = normalizeEmail(rawEmail);
        EmailOtp emailOtp = emailOtpRepository.findFirstByEmailOrderByCreatedAtDesc(email)
            .orElseThrow(AuthException::otpNotFound);

        if (emailOtp.isVerified()) {
            throw AuthException.otpAlreadyUsed();
        }

        if (emailOtp.isUsed()) {
            throw AuthException.otpAlreadyUsed();
        }

        if (emailOtp.isExpired()) {
            emailOtp.setUsed(true);
            emailOtpRepository.save(emailOtp);
            throw AuthException.expiredOtp();
        }

        if (emailOtp.getAttemptCount() >= maxAttempts) {
            emailOtp.setUsed(true);
            emailOtpRepository.save(emailOtp);
            throw AuthException.tooManyAttempts();
        }

        if (!passwordEncoder.matches(otp, emailOtp.getOtpHash())) {
            emailOtp.setAttemptCount(emailOtp.getAttemptCount() + 1);
            if (emailOtp.getAttemptCount() >= maxAttempts) {
                emailOtp.setUsed(true);
            }
            emailOtpRepository.save(emailOtp);

            if (emailOtp.getAttemptCount() >= maxAttempts) {
                throw AuthException.tooManyAttempts();
            }
            throw AuthException.invalidOtp();
        }

        emailOtp.setUsed(true);
        emailOtp.setVerified(true);
        emailOtpRepository.save(emailOtp);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("email", email);
        response.put("verified", true);
        response.put("verificationExpiresAt", emailOtp.getExpiresAt());
        return response;
    }

    @Transactional(readOnly = true)
    public boolean isEmailVerifiedForRegistration(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        return emailOtpRepository.findFirstByEmailOrderByCreatedAtDesc(email)
            .filter(EmailOtp::isVerified)
            .filter(otp -> !otp.isExpired())
            .isPresent();
    }

    private String normalizeEmail(String rawEmail) {
        return rawEmail == null ? "" : rawEmail.trim().toLowerCase();
    }

    private String deriveRecipientName(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex <= 0) {
            return "there";
        }

        String localPart = email.substring(0, atIndex).replace('.', ' ').replace('_', ' ').trim();
        if (localPart.isBlank()) {
            return "there";
        }

        return Character.toUpperCase(localPart.charAt(0)) + localPart.substring(1);
    }

    private String generateSixDigitOtp() {
        int value = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(value);
    }
}
