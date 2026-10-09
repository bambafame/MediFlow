package com.mediflow.dto.patient;

import jakarta.validation.constraints.Email;

import java.time.LocalDate;

public record UpdatePatientRequest(

    String firstName,
    String lastName,

    @Email
    String email,

    String phoneNumber,
    LocalDate dateOfBirth,
    String mailingAddress
) {
}