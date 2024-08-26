package com.BlumaEmailBackend.BlumaEmail.service;

import com.BlumaEmailBackend.BlumaEmail.dtos.request.CreateEventRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.PurchaseTicketRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.RefundTicketFeeRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.request.UpdateCreatorRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.EmailResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class EmailServicesTest {

    @Autowired
    private  BlumaEmailService blumaEmailService;


    @Test
    public void testCreateAccount() {
      EmailResponse response =  blumaEmailService.createAccountMail("ebukizy1@gmail.com");
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());
    }

    @Test
    public void testCreateEvent(){
        CreateEventRequest request = new CreateEventRequest();
        request.setEmail("ebukizy1@gmail.com");
        request.setLocation("https://email-service-backend-1.onrender.com/swagger-ui/index.html#/email-verification-controller/verifyOtpMail");
        request.setEventTitle("ONLY DUST EVENT");
        EmailResponse response = blumaEmailService.createEventMail(request);
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());
    }

    @Test
    public void testPurchaseTicket(){
        PurchaseTicketRequest request = new PurchaseTicketRequest();
        request.setEmail("ebukizy1@gmail.com");
        request.setAmount(200);
        request.setTitle("ONLY DUST EVENT");
        request.setLocation("https://email-service-backend-1.onrender.com/swagger-ui/index.html#/email-verification-controller/verifyOtpMail");
        EmailResponse response = blumaEmailService.purchaseTicketMail(request);
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());
    }

    @Test
    public void testRefundTicketMail(){
        RefundTicketFeeRequest request = new RefundTicketFeeRequest();
        request.setEmail("ebukizy1@gmail.com");
        request.setAmount(500);
        request.setTitle("ONLY DUST EVENT");
        EmailResponse response = blumaEmailService.refundTicketFeeMail(request);
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());

    }

    @Test
    public void testUpdateCreatorPurchaseTicketMail(){
        UpdateCreatorRequest request = new UpdateCreatorRequest();
        request.setEmail("ebukizy1@gmail.com");
        request.setAmount(500);
        request.setTitle("ONLY DUST EVENT");
        EmailResponse response = blumaEmailService.updateCreatorOnPurchaseTicketMail(request);
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());

    }
    @Test
    public void testUpdateCreatorRefundTicketMail(){
        UpdateCreatorRequest request = new UpdateCreatorRequest();
        request.setEmail("ebukizy1@gmail.com");
        request.setAmount(500);
        request.setTitle("ONLY DUST EVENT");
        EmailResponse response = blumaEmailService.updateCreatorOnRefundFeeMail(request);
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());
    }

    @Test
    public void testWithdrawnFee(){
        UpdateCreatorRequest request = new UpdateCreatorRequest();
        request.setEmail("ebukizy1@gmail.com");
        request.setAmount(500);
        request.setTitle("ONLY DUST EVENT");
        EmailResponse response = blumaEmailService.withdrawnFeeEventMail(request);
        assertThat(response.getMessageId()).isNotNull();
        assertThat(response.getCode()).isNotNull();
        assertEquals(201, response.getCode());
    }




}
//=======
//package com.blocklend.lending.protocol.services;
//
//import com.blocklend.lending.protocol.dtos.response.EmailResponse;
//import com.blocklend.lending.protocol.mailservice.OtpService;
//import com.blocklend.lending.protocol.mailservice.Recipient;
//import lombok.RequiredArgsConstructor;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//@SpringBootTest
//public class EmailServicesTest {
//
//    @Autowired
//    private  OtpService optServices;
//
//
//
//
//    @Test
//    public void testSendOpt() {
//        Recipient recipient = new Recipient();
//        recipient.setEmail("ebukizy1@gmail.com");
//        EmailResponse response = optServices.generateOtp(recipient);
//        assertThat(response.getMessageId()).isNotNull();
//        assertThat(response.getCode()).isNotNull();
//        assertEquals(201, response.getCode());
//    }
//>>>>>>> 06467cd8bbfa7918b94682c7187744e342a6edf6
//    @Test
//    public void testVerifyOtp() {
////        String optCode = optServices.validateOtpCode("ebukizy1@gmail.com", "186747");
////        assertThat(optCode).isNotNull();
////        assertEquals(optCode, "successfully validated");
//
//    }
//
//    @Test
//    public void sendOffer(){
//
//
//    }
//
//
//
//
//
//<<<<<<< HEAD
//}
//=======
////}
//>>>>>>> 06467cd8bbfa7918b94682c7187744e342a6edf6
