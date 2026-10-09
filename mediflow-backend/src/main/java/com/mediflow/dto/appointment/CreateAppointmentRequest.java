package com.mediflow.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateAppointmentRequest(

    @NotNull
    Long patientId,

    @NotNull
    Long doctorId,

    @NotNull
    @Future
    LocalDateTime startDateTime,

    @NotNull
    @Future
    LocalDateTime endDateTime,

    @NotBlank
    String reason
) {
}