package com.BlumaEmailBackend.BlumaEmail.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


    @Configuration
    @Getter
    public class MailConfig {
        @Value("${mail.api.key}")
        private String mailApiKey;
        @Value("${brevo.mail.url}")
        private String brevoMailUrl;
    }

