package com.app.auth.service;

import com.app.auth.dto.RegisterRequest;
import com.app.auth.dto.SendOtpRequest;
import com.app.auth.dto.VerifyOtpRequest;
import com.app.auth.dto.LoginRequest;
import com.app.auth.dto.SharedLoginRequest;

import com.app.auth.entity.User;
import com.app.auth.exception.AuthException;
import com.app.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final OtpService otpService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SessionService sessionService;

    @Value("${app.shared.vault-access-key:}")
    private String sharedVaultAccessKey;

    private static final String SHARED_VAULT_EMAIL = "vault-access@local";


    public Map<String, Object> sendOtp(SendOtpRequest request) {
        return otpService.sendOtp(request.email());
    }

    public Map<String, Object> verifyOtp(VerifyOtpRequest request) {
        return otpService.verifyOtp(request.email(), request.otp());
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request, HttpServletResponse response) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw AuthException.emailAlreadyRegistered();
        }

        if (!otpService.isEmailVerifiedForRegistration(email)) {
            throw AuthException.emailNotVerified();
        }

        User user = User.builder()
            .email(email)
            .passwordHash(passwordEncoder.encode(request.password()))
            .fullName(request.fullName().trim())
            .verified(true)
            .build();

        userRepository.save(user);
        emailService.sendWelcomeEmail(email, user.getFullName());
        sessionService.createSession(user, response);

        return buildUserPayload(user);
    }

    @Transactional
    public Map<String, Object> login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase())
            .orElseThrow(AuthException::invalidCredentials);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw AuthException.invalidCredentials();
        }

        sessionService.createSession(user, response);
        return buildUserPayload(user);
    }

    @Transactional
    public Map<String, Object> sharedLogin(SharedLoginRequest request, HttpServletResponse response) {
        if (sharedVaultAccessKey == null || sharedVaultAccessKey.isBlank()) {
            throw AuthException.unauthenticated();
        }

        String provided = request.accessKey();
        if (!sharedVaultAccessKey.equals(provided)) {
            throw AuthException.invalidCredentials();
        }

        User sharedUser = userRepository.findByEmailIgnoreCase(SHARED_VAULT_EMAIL)
            .orElseGet(() -> {
                // Password is never used for shared login; still must satisfy schema constraints.
                String passwordHash = passwordEncoder.encode("shared-vault-unused-password");
                return User.builder()
                    .email(SHARED_VAULT_EMAIL)
                    .passwordHash(passwordHash)
                    .fullName("Vault Access")
                    .verified(true)
                    .build();
            });

        if (sharedUser.getId() == null) {
            userRepository.save(sharedUser);
        }

        sessionService.createSession(sharedUser, response);
        return buildUserPayload(sharedUser);
    }


    @Transactional
    public Map<String, Object> session(HttpServletRequest request, HttpServletResponse response) {
        User user = sessionService.resolveUser(request).orElse(null);
        if (user == null) {
            sessionService.clearInvalidSession(response);
            throw AuthException.unauthenticated();
        }

        return buildUserPayload(user);
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        sessionService.logout(request, response);
    }

    private Map<String, Object> buildUserPayload(User user) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("verified", user.isVerified());
        return response;
    }
}
