package com.mediflow.dto.doctor;

import jakarta.validation.constraints.Email;

public record UpdateDoctorRequest(

    String firstName,
    String lastName,

    @Email
    String email,

    String phoneNumber,
    String licenseNumber,
    String bio,
    Long specializationId
) {
}