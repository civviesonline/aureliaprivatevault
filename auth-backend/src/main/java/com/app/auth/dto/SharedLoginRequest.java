package com.app.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record SharedLoginRequest(
    @NotBlank(message = "Access key is required.")
    String accessKey
) {
}

