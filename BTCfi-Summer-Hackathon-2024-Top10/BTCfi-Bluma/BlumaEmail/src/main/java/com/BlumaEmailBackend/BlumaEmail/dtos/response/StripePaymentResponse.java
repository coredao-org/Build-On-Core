package com.BlumaEmailBackend.BlumaEmail.dtos.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StripePaymentResponse {


        private String intentID;

        private String clientSecret;


}
