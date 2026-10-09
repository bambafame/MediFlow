package com.mediflow.dto.doctor;

public record DoctorResponse(

    Long id,
    String username,
    String email,
    String phoneNumber,
    String firstName,
    String lastName,
    String licenseNumber,
    String bio,
    Long specializationId,
    String specializationName,
    boolean enabled
) {
}