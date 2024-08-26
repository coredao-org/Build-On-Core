package com.BlumaEmailBackend.BlumaEmail.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefundTicketFeeRequest {

    @NotNull
    private String email;
    @NotNull
    private int amount;
    @NotNull
    private String title;

}
