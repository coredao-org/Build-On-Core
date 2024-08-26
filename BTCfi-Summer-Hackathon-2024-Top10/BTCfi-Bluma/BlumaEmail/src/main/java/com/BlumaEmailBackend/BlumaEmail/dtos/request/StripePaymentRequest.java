package com.BlumaEmailBackend.BlumaEmail.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StripePaymentRequest {
    @NotNull
    private Long amount;
    @NotNull
   private String eventName;
    @NotNull
   private Long quantity;
    @NotNull
   private String redirectUrl;

}
