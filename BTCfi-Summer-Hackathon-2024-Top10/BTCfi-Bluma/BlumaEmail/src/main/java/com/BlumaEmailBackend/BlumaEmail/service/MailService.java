package com.BlumaEmailBackend.BlumaEmail.service;

import com.BlumaEmailBackend.BlumaEmail.dtos.request.EmailRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.EmailResponse;


public interface MailService {


    EmailResponse sendMail(EmailRequest emailRequest);
}