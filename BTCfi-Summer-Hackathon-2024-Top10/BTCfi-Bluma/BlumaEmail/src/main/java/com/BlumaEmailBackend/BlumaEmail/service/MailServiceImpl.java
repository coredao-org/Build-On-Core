package com.BlumaEmailBackend.BlumaEmail.service;


import com.BlumaEmailBackend.BlumaEmail.config.MailConfig;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.EmailRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.EmailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService{

    private final MailConfig mailConfig;

    @Override
    public EmailResponse sendMail(EmailRequest emailRequest) {

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(APPLICATION_JSON);
        httpHeaders.set("accept", APPLICATION_JSON_VALUE);
        httpHeaders.set("api-key", mailConfig.getMailApiKey());
        HttpEntity<EmailRequest> requestEntity = new HttpEntity<>(emailRequest, httpHeaders);
        ResponseEntity<EmailResponse> responseEntity = restTemplate.exchange(mailConfig.getBrevoMailUrl(), POST, requestEntity, EmailResponse.class);
        var emailResponse = responseEntity.getBody();
        assert emailResponse != null;
        emailResponse.setCode(responseEntity.getStatusCode().value());
        return emailResponse;

    }


}
