package com.BlumaEmailBackend.BlumaEmail.service;


import com.BlumaEmailBackend.BlumaEmail.dtos.request.*;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.EmailResponse;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.RecipientResponse;
import com.BlumaEmailBackend.BlumaEmail.exception.EmptyEmailInputException;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BlumaMailServiceImpl  implements  BlumaEmailService{

    private final MailService mailService;
    private final TemplateEngine templateEngine;

       // Get the current date and time
            LocalDateTime now = LocalDateTime.now();

            // Format the current date
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String formattedDate = now.format(dateFormatter);

            // Format the current time
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            String formattedTime = now.format(timeFormatter);


    @Override
    public EmailResponse createAccountMail(String email) {
        validateString(email);
        RecipientResponse recipientResponse =  recipientDetails(email);
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "currentTime", formattedDate + " " + formattedTime // Add the formatted current time to the context
                )
        );
        final String content = templateEngine.process("register_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }

    @Override
    public EmailResponse createEventMail(CreateEventRequest request) {
        RecipientResponse recipientResponse =  recipientDetails(request.getEmail());
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "eventName", request.getEventTitle(),
                        "eventDate",formattedDate , // Add the formatted current time to the context
                        "eventTime", formattedTime,
                        "eventLocation", request.getLocation()
                )
        );
        final String content = templateEngine.process("event_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }

    @Override
    public EmailResponse purchaseTicketMail(PurchaseTicketRequest request) {
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .build();
        RecipientResponse recipientResponse =  recipientDetails(request.getEmail());
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "eventTitle", request.getTitle(),
                        "amount", request.getAmount(),
                        "purchaseTime",formattedDate + " " + formattedTime,// Add the formatted current time to the context
                            "eventLocation", request.getLocation()
                )
        );
        final String content = templateEngine.process("purchase_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }

    public EmailResponse updateCreatorOnPurchaseTicketMail(UpdateCreatorRequest request){
        RecipientResponse recipientResponse =  recipientDetails(request.getEmail());
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "eventTitle", request.getTitle(),
                        "amount", request.getAmount(),
                        "purchaseDate", formattedDate,
                        "purchaseTime", formattedTime // Add the formatted current time to the context
                )
        );
        final String content = templateEngine.process("updateCreatorTicketPurchase_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }


    @Override
    public EmailResponse refundTicketFeeMail(RefundTicketFeeRequest request) {
        RecipientResponse recipientResponse =  recipientDetails(request.getEmail());
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "eventTitle", request.getTitle(),
                        "amount", request.getAmount(),
                        "purchaseTime",formattedDate + " " + formattedTime// Add the formatted current time to the context
                )
        );
        final String content = templateEngine.process("refundTicketFee_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }

    public EmailResponse updateCreatorOnRefundFeeMail(UpdateCreatorRequest request){
        RecipientResponse recipientResponse =  recipientDetails(request.getEmail());
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "eventTitle", request.getTitle(),
                        "amount", request.getAmount(),
                        "purchaseTime",formattedDate + " " + formattedTime// Add the formatted current time to the context
                )
        );
        final String content = templateEngine.process("updateCreatorRefundFee_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }


    @Override
    public EmailResponse withdrawnFeeEventMail(UpdateCreatorRequest request) {
        RecipientResponse recipientResponse =  recipientDetails(request.getEmail());
        final Context context = new Context();
        assert recipientResponse.getUsername() != null;
        context.setVariables(	//these are the placeholders in the email template
                Map.of(
                        "fullName", recipientResponse.getUsername(),
                        "eventTitle", request.getTitle(),
                        "amount", request.getAmount(),
                        "purchaseTime",formattedDate + " " + formattedTime// Add the formatted current time to the context
                )
        );
        final String content = templateEngine.process("withdrawnFee_mail", context);
        List<Recipient> recipients = List.of(
                recipientResponse.getRecipient()
        );
        return sendMailRequest(recipients, content);
    }

    private void validateString(String email) {
        if(email.isEmpty()) throw new EmptyEmailInputException("email input can be empty");
    }

    private String extractUserName(String email) {
        // Split the email at '@' and take the first part (username)
        String[] parts = email.split("@");
        if (parts.length > 1) {
            return parts[0]; // Return the username
        } else {
            return null; // Return null or handle the error as needed
        }
    }

    private EmailResponse sendMailRequest(List<Recipient> recipients, String content) {
        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setRecipients(recipients);
        emailRequest.setSubject("BLUMA EVENT PLATFORM");
        emailRequest.setHtmlContent(content);
        return mailService.sendMail(emailRequest);
    }

    private  RecipientResponse recipientDetails(String email){
        String username = extractUserName(email);
        Recipient recipient = new Recipient();
        recipient.setEmail(email);
        recipient.setName(username);
        RecipientResponse recipientResponse = new RecipientResponse();
        recipientResponse.setRecipient(recipient);
        recipientResponse.setUsername(recipient.getName());
        return recipientResponse;
    }
}
