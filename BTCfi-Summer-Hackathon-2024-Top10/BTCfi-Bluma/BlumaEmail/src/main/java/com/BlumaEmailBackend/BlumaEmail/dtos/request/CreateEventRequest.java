package com.BlumaEmailBackend.BlumaEmail.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
public class CreateEventRequest {
    @NotNull
    private String email;
    @NotNull
    private String eventTitle;
    @NotNull
    private String location;
}
