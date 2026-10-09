package com.mediflow.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RescheduleAppointmentRequest(

    @NotNull
    @Future
    LocalDateTime startDateTime,

    @NotNull
    @Future
    LocalDateTime endDateTime
) {
}