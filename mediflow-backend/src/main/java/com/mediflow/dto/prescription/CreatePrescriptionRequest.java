package com.mediflow.dto.prescription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePrescriptionRequest(

    @NotNull
    Long consultationId,

    @NotBlank
    String medicationName,

    String dosage,

    String instructions
) {
}