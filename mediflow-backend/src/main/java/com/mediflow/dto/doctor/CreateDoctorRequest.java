package com.mediflow.dto.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateDoctorRequest(

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

    @NotBlank
    String licenseNumber,

    String bio,

    @NotNull
    Long specializationId
) {
}