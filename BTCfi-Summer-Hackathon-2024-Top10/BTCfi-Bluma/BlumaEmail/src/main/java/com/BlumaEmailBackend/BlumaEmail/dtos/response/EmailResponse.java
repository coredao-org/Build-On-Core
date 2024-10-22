package com.BlumaEmailBackend.BlumaEmail.dtos.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class EmailResponse {
    private String messageId;
    private Integer code;
}

