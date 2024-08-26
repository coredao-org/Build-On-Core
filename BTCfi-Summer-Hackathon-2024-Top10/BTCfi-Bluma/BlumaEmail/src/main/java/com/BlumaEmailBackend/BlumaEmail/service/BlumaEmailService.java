package com.BlumaEmailBackend.BlumaEmail.service;


import com.BlumaEmailBackend.BlumaEmail.dtos.request.CreateEventRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.PurchaseTicketRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.RefundTicketFeeRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.UpdateCreatorRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.EmailResponse;

public interface BlumaEmailService {

    EmailResponse createAccountMail(String email);
    EmailResponse createEventMail(CreateEventRequest request);
    EmailResponse purchaseTicketMail(PurchaseTicketRequest request);
    EmailResponse refundTicketFeeMail(RefundTicketFeeRequest request);
    EmailResponse withdrawnFeeEventMail(UpdateCreatorRequest request);
    EmailResponse updateCreatorOnPurchaseTicketMail(UpdateCreatorRequest request);
    EmailResponse updateCreatorOnRefundFeeMail(UpdateCreatorRequest request);

}

