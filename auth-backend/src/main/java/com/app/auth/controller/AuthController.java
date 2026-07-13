package com.app.auth.controller;

import com.app.auth.dto.ApiResponse;
import com.app.auth.dto.LoginRequest;
import com.app.auth.dto.RegisterRequest;
import com.app.auth.dto.SendOtpRequest;
import com.app.auth.dto.VerifyOtpRequest;
import com.app.auth.dto.SharedLoginRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.app.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        Map<String, Object> data = authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP sent successfully.", data));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        Map<String, Object> data = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully.", data));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
        @Valid @RequestBody RegisterRequest request,
        HttpServletResponse response
    ) {
        Map<String, Object> data = authService.register(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Account created successfully.", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletResponse response
    ) {
        Map<String, Object> data = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Signed in successfully.", data));
    }

    @PostMapping("/shared-login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sharedLogin(
        @Valid @RequestBody SharedLoginRequest request,
        HttpServletResponse response
    ) {
        Map<String, Object> data = authService.sharedLogin(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Vault unlocked successfully.", data));
    }


    @GetMapping("/session")
    public ResponseEntity<ApiResponse<Map<String, Object>>> session(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        Map<String, Object> data = authService.session(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Session restored.", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.ok("Signed out successfully."));
    }
}
