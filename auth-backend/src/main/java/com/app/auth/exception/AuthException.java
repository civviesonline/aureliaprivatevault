package com.app.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AuthException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public AuthException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public static AuthException expiredOtp() {
        return new AuthException("OTP has expired. Please request a new one.", HttpStatus.GONE, "OTP_EXPIRED");
    }

    public static AuthException invalidOtp() {
        return new AuthException("Invalid OTP. Please try again.", HttpStatus.UNAUTHORIZED, "OTP_INVALID");
    }

    public static AuthException tooManyAttempts() {
        return new AuthException("Too many failed attempts. Please request a new OTP.", HttpStatus.TOO_MANY_REQUESTS, "TOO_MANY_ATTEMPTS");
    }

    public static AuthException otpAlreadyUsed() {
        return new AuthException("This OTP has already been used.", HttpStatus.CONFLICT, "OTP_ALREADY_USED");
    }

    public static AuthException rateLimitExceeded() {
        return new AuthException("Too many OTP requests. Please wait before trying again.", HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED");
    }

    public static AuthException emailAlreadyRegistered() {
        return new AuthException("An account with this email already exists.", HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS");
    }

    public static AuthException emailNotVerified() {
        return new AuthException("Email has not been verified. Please complete OTP verification first.", HttpStatus.FORBIDDEN, "EMAIL_NOT_VERIFIED");
    }

    public static AuthException otpNotFound() {
        return new AuthException("No valid OTP found for this email. Please request a new one.", HttpStatus.NOT_FOUND, "OTP_NOT_FOUND");
    }

    public static AuthException emailDeliveryFailed() {
        return new AuthException("Unable to deliver email right now. Please try again shortly.", HttpStatus.SERVICE_UNAVAILABLE, "EMAIL_DELIVERY_FAILED");
    }

    public static AuthException invalidCredentials() {
        return new AuthException("Invalid email or password.", HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS");
    }

    public static AuthException unauthenticated() {
        return new AuthException("You need to sign in to continue.", HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED");
    }
}
