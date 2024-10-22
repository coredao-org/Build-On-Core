package com.BlumaEmailBackend.BlumaEmail.controller;

import com.BlumaEmailBackend.BlumaEmail.dtos.request.StripePaymentRequest;
import com.BlumaEmailBackend.BlumaEmail.service.stripepayment.StripePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/stripePayment")
public class StripePaymentController {

    private  final StripePaymentService stripePaymentService;


    @PostMapping("/stripePaymentLink")
    public ResponseEntity<String> stripePaymentLink(@RequestBody StripePaymentRequest request) {
        return ResponseEntity.ok(stripePaymentService.createStripePaymentLink(request));
    }

}
