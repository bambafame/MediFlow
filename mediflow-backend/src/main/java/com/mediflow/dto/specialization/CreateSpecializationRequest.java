package com.mediflow.dto.specialization;

import jakarta.validation.constraints.NotBlank;

public record CreateSpecializationRequest(

    @NotBlank
    String name,

    String description
) {
}