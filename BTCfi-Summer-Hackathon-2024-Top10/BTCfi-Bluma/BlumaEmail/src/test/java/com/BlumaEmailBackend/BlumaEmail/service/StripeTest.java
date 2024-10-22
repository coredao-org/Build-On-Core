package com.BlumaEmailBackend.BlumaEmail.service;

import com.BlumaEmailBackend.BlumaEmail.dtos.request.StripePaymentRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.StripePaymentResponse;
import com.BlumaEmailBackend.BlumaEmail.service.stripepayment.StripePaymentService;
import com.stripe.model.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class StripeTest {

    @Autowired
    private StripePaymentService stripePaymentService;


    @Test
    public void testCreateProduct(){
        StripePaymentRequest request = new StripePaymentRequest();
        request.setEventName("CAIRO MASTER CLASS EVENT");
        request.setAmount(500L);
        request.setQuantity(2L);
        request.setRedirectUrl("https://www.youtube.com/watch?v=xIgP-Tu0IKs&t=599s");
        String paymentLink = stripePaymentService.createStripePaymentLink(request);
        System.out.println("#################" + paymentLink);
        assertNotNull(paymentLink);
    }

}
