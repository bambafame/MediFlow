package com.mediflow.dto.consultation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateConsultationRequest(

    @NotNull
    Long appointmentId,

    @NotBlank
    String notes,

    String diagnosis
) {
}