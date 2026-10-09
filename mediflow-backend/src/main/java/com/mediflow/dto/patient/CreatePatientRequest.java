package com.mediflow.dto.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreatePatientRequest(

    @NotBlank
    String username,

    @NotBlank
    String password,

    @NotBlank
    @Email
    String email,

    String phoneNumber,

    @NotBlank
    String firstName,

    @NotBlank
    String lastName,

    @NotNull
    LocalDate dateOfBirth,

    String mailingAddress
) {
}