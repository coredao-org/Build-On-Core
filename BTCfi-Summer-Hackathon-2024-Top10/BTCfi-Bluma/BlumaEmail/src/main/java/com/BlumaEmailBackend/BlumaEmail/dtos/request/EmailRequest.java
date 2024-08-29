package com.BlumaEmailBackend.BlumaEmail.dtos.request;



import com.BlumaEmailBackend.BlumaEmail.service.Recipient;
import com.BlumaEmailBackend.BlumaEmail.service.Sender;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class EmailRequest{

    private final Sender sender;

    @JsonProperty("to")
    private List<Recipient> recipients;

    private String subject;

    private String htmlContent;

    public EmailRequest() {
        this.sender = new Sender("BLUMA","Bluma@gmail.com");
    }

}
