package com.BlumaEmailBackend.BlumaEmail.service.stripepayment;


import com.BlumaEmailBackend.BlumaEmail.dtos.request.StripePaymentRequest;
import com.BlumaEmailBackend.BlumaEmail.dtos.response.StripePaymentResponse;
import com.BlumaEmailBackend.BlumaEmail.exception.BlumaException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentLink;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentLinkCreateParams;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeServiceImpl implements StripePaymentService{

    @Value("${stripe.api.secretKey}")
    private String stripeApiKeySK;


    @PostConstruct
    private void addStripeSecretKey() {
        Stripe.apiKey = stripeApiKeySK;
    }



    public String createStripePaymentLink(StripePaymentRequest request)  {
        try {
        ProductCreateParams productParams = ProductCreateParams.builder()
                .setName(request.getEventName())
                .build();
            var product = Product.create(productParams);

            PriceCreateParams priceParams = PriceCreateParams.builder()
                    .setCurrency("usd")
                    .setUnitAmount(request.getAmount() * 100)
                    .setProduct(product.getId())
                    .build();

            var price = Price.create(priceParams);

            PaymentLinkCreateParams paymentParams = PaymentLinkCreateParams.builder()
                    .addLineItem(PaymentLinkCreateParams.LineItem.builder()
                            .setPrice(price.getId())
                            .setQuantity(request.getQuantity())
                            .build()
                    )
                    .setAfterCompletion(PaymentLinkCreateParams.AfterCompletion.builder()
                            .setType(PaymentLinkCreateParams.AfterCompletion.Type.REDIRECT)
                            .setRedirect(PaymentLinkCreateParams.AfterCompletion.Redirect.builder()
                                    .setUrl(request.getRedirectUrl())
                                    .build()
                            )
                            .build()
                    )
                    .build();
            var payment = PaymentLink.create(paymentParams);
            return payment.getUrl();

        } catch (StripeException e) {
            throw new BlumaException(e.getMessage());
        }

    }
}
