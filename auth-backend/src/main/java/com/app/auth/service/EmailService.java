package com.app.auth.service;

import com.app.auth.config.AppSendGridProperties;
import com.app.auth.exception.AuthException;
import com.app.auth.template.OtpEmailTemplate;
import com.app.auth.template.WelcomeEmailTemplate;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<SendGrid> sendGridProvider;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AppSendGridProperties sendGridProperties;
    private final boolean smtpFallbackEnabled;
    private final String smtpFromEmail;
    private final String smtpFromName;

    public EmailService(
        ObjectProvider<SendGrid> sendGridProvider,
        ObjectProvider<JavaMailSender> mailSenderProvider,
        AppSendGridProperties sendGridProperties,
        @Value("${app.mail.smtp-fallback-enabled:true}") boolean smtpFallbackEnabled,
        @Value("${app.mail.smtp-from-email:}") String smtpFromEmail,
        @Value("${app.mail.smtp-from-name:YourApp}") String smtpFromName
    ) {
        this.sendGridProvider = sendGridProvider;
        this.mailSenderProvider = mailSenderProvider;
        this.sendGridProperties = sendGridProperties;
        this.smtpFallbackEnabled = smtpFallbackEnabled;
        this.smtpFromEmail = smtpFromEmail;
        this.smtpFromName = smtpFromName;
    }

    public void sendOtpEmail(String email, String recipientName, String otp, int expiryMinutes) {
        String subject = "Your verification code";
        String html = OtpEmailTemplate.build(recipientName, otp, expiryMinutes, sendGridProperties.getFromName());
        sendCriticalEmail(email, subject, html);
    }

    public void sendWelcomeEmail(String email, String fullName) {
        String subject = "Welcome to " + sendGridProperties.getFromName();
        String html = WelcomeEmailTemplate.build(fullName, sendGridProperties.getFromName());
        if (!sendBestEffortEmail(email, subject, html)) {
            log.warn("Welcome email delivery failed for {}", email);
        }
    }

    private void sendCriticalEmail(String email, String subject, String html) {
        if (!sendBestEffortEmail(email, subject, html)) {
            throw AuthException.emailDeliveryFailed();
        }
    }

    private boolean sendBestEffortEmail(String email, String subject, String html) {
        if (sendWithSendGrid(email, subject, html)) {
            return true;
        }
        return sendWithSmtp(email, subject, html);
    }

    private boolean sendWithSendGrid(String email, String subject, String html) {
        SendGrid sendGrid = sendGridProvider.getIfAvailable();
        if (sendGrid == null || !StringUtils.hasText(sendGridProperties.getFromEmail())) {
            return false;
        }

        Mail mail = new Mail(
            new Email(sendGridProperties.getFromEmail(), sendGridProperties.getFromName()),
            subject,
            new Email(email),
            new Content("text/html", html)
        );

        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        try {
            Response response = sendGrid.api(request);
            int statusCode = response.getStatusCode();
            if (statusCode >= 200 && statusCode < 300) {
                return true;
            }

            log.warn("SendGrid returned status {} for {}", statusCode, email);
            return false;
        } catch (Exception ex) {
            log.warn("SendGrid email delivery failed for {}: {}", email, ex.getMessage());
            return false;
        }
    }

    private boolean sendWithSmtp(String email, String subject, String html) {
        if (!smtpFallbackEnabled || !StringUtils.hasText(smtpFromEmail)) {
            return false;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setFrom(smtpFromEmail, smtpFromName);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            return true;
        } catch (Exception ex) {
            log.warn("SMTP email delivery failed for {}: {}", email, ex.getMessage());
            return false;
        }
    }
}
