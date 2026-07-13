package com.app.auth.service;

import com.app.auth.entity.AuthSession;
import com.app.auth.entity.User;
import com.app.auth.repository.AuthSessionRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final AuthSessionRepository authSessionRepository;
    private final SecureRandom secureRandom;

    @Value("${app.session.cookie-name:AURELIA_SESSION}")
    private String cookieName;

    @Value("${app.session.max-age-days:30}")
    private int maxAgeDays;

    // Enforce Secure cookies by default. For local HTTP development you can override via
    // app.session.secure=false, but production should keep Secure=true.
    @Value("${app.session.secure:true}")
    private boolean secureCookie;


    @Transactional
    public void createSession(User user, HttpServletResponse response) {
        purgeExpiredSessions();

        String rawToken = generateToken();
        LocalDateTime now = LocalDateTime.now();
        AuthSession session = AuthSession.builder()
            .user(user)
            .tokenHash(hashToken(rawToken))
            .expiresAt(now.plusDays(maxAgeDays))
            .lastUsedAt(now)
            .build();

        authSessionRepository.save(session);
        writeSessionCookie(response, rawToken, Duration.ofDays(maxAgeDays));
    }

    @Transactional
    public Optional<User> resolveUser(HttpServletRequest request) {
        String rawToken = readSessionToken(request);
        if (!StringUtils.hasText(rawToken)) {
            return Optional.empty();
        }

        Optional<AuthSession> session = authSessionRepository.findByTokenHash(hashToken(rawToken));
        if (session.isEmpty()) {
            return Optional.empty();
        }

        if (session.get().isExpired()) {
            authSessionRepository.delete(session.get());
            return Optional.empty();
        }

        session.get().setLastUsedAt(LocalDateTime.now());
        authSessionRepository.save(session.get());
        return Optional.of(session.get().getUser());
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = readSessionToken(request);
        if (StringUtils.hasText(rawToken)) {
            authSessionRepository.deleteByTokenHash(hashToken(rawToken));
        }
        clearSessionCookie(response);
    }

    public void clearInvalidSession(HttpServletResponse response) {
        clearSessionCookie(response);
    }

    @Transactional
    public void purgeExpiredSessions() {
        authSessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private void writeSessionCookie(HttpServletResponse response, String rawToken, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, rawToken)
            .httpOnly(true)
            .secure(secureCookie)
            .sameSite("Strict")
            .path("/")
            .maxAge(maxAge)
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
            .httpOnly(true)
            .secure(secureCookie)
            .sameSite("Strict")
            .path("/")
            .maxAge(Duration.ZERO)
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String readSessionToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash session token", ex);
        }
    }
}
