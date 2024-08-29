package com.BlumaEmailBackend.BlumaEmail.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
      info =  @Info(
           contact = @Contact(
                   name = "BLUMA EVENT PLATFORM",
                   email = "bluma@gmail.com",
                   url = "/"
           ),
              description = "OpenApi Documentation for BLUMA EVENT PLATFORM ",
              title = "OpenApi specification - BLUMA EVENT PROTOCOL",
              version = "1.0",
              license = @License(
                      name = "license name",
                      url = "https://some-url.com"
              ),
              termsOfService = "Terms of Service"
        ),
        servers = {
              @Server(
                      description = "local ENV",
                      url = "http://localhost:8080"
              ),
                @Server(
                        description = "prod Env",
                        url = "/"
                )
        }
//        security = {
//                @SecurityRequirement(
//                        name = "bearerAuth"
//                )
//
//        }
)
//@SecurityScheme(
//        name = "bearerAuth",
//        description = "JWT auth description",
//        scheme = "bearer",
//        type = SecuritySchemeType.HTTP,
//        bearerFormat = "JWT",
//        in = SecuritySchemeIn.HEADER
//)
public class OpenApiConfig {
}
