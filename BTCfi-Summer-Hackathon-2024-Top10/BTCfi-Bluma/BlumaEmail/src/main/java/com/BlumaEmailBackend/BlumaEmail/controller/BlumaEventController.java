package com.BlumaEmailBackend.BlumaEmail.controller;

import com.BlumaEmailBackend.BlumaEmail.dtos.request.CreateEventRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.PurchaseTicketRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.RefundTicketFeeRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.UpdateCreatorRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.EmailResponse;
import com.BlumaEmailBackend.BlumaEmail.service.BlumaEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1")
public class BlumaEventController {

    private final BlumaEmailService blumaEmailService;

    @PostMapping("/createAccount")
    public ResponseEntity<EmailResponse> createAccountMail(String email) {
        return ResponseEntity.status(CREATED).body(blumaEmailService.createAccountMail(email));
    }

    @PostMapping("/createEvent")
    public ResponseEntity<EmailResponse> createEventMail(@RequestBody CreateEventRequest request) {
        return ResponseEntity.status(CREATED).body(blumaEmailService.createEventMail(request));
    }

    @PostMapping("/purchaseTicket")
    public ResponseEntity<EmailResponse> purchaseTicketMail(@RequestBody PurchaseTicketRequest request) {
        return ResponseEntity.ok(blumaEmailService.purchaseTicketMail(request));
    }

    @PostMapping("/updateCreatorOnPurchaseTicket")
    public ResponseEntity<EmailResponse> creatorTicketPurchaseMail(@RequestBody UpdateCreatorRequest request) {
        return ResponseEntity.ok(blumaEmailService.updateCreatorOnPurchaseTicketMail(request));
    }

    @PostMapping("/refundTicketFee")
    public ResponseEntity<EmailResponse> refundTicketMail(@RequestBody RefundTicketFeeRequest request) {
        return ResponseEntity.ok(blumaEmailService.refundTicketFeeMail(request));
    }


    @PostMapping("/updateCreatorTicketRefund")
    public ResponseEntity<EmailResponse> creatorTicketRefundMail(@RequestBody UpdateCreatorRequest request) {
        return ResponseEntity.ok(blumaEmailService.updateCreatorOnRefundFeeMail(request));
    }
    @PostMapping("/withdrawnEventFee")
    public ResponseEntity<EmailResponse> withdrawnEventFeeMail(@RequestBody UpdateCreatorRequest request) {
        return ResponseEntity.ok(blumaEmailService.withdrawnFeeEventMail(request));
    }

    @GetMapping("/wakeRender")
    public ResponseEntity<String> wakeRender() {
        return ResponseEntity.ok("Render server is awake");
    }









}
