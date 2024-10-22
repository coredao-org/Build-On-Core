package com.BlumaEmailBackend.BlumaEmail.dtos.response;

import com.BlumaEmailBackend.BlumaEmail.service.Recipient;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipientResponse {
    private Recipient recipient;
    private String username;
}
