package com.app.auth.config;

import com.sendgrid.SendGrid;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SendGridConfig {

    @Bean
    public SendGrid sendGrid(AppSendGridProperties properties) {
        return new SendGrid(properties.getApiKey());
    }
}
