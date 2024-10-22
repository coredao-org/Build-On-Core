package com.BlumaEmailBackend.BlumaEmail.service.stripepayment;

import com.BlumaEmailBackend.BlumaEmail.dtos.request.StripePaymentRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.StripePaymentResponse;
import com.stripe.model.PaymentLink;
import com.stripe.model.Price;
import com.stripe.model.Product;

public interface StripePaymentService {

    String createStripePaymentLink(StripePaymentRequest request);



}
