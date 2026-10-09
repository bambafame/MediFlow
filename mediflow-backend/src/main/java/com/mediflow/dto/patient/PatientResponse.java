package com.mediflow.dto.patient;

import java.time.LocalDate;

public record PatientResponse(

    Long id,
    String username,
    String email,
    String phoneNumber,
    String firstName,
    String lastName,
    LocalDate dateOfBirth,
    int age,
    String mailingAddress,
    boolean enabled
) {
}