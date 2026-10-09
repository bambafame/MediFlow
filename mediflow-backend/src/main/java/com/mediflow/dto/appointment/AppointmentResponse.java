package com.mediflow.dto.appointment;

import com.mediflow.entity.AppointmentStatus;

import java.time.LocalDateTime;

public record AppointmentResponse(

    Long appointmentId,

    Long patientId,
    String patientName,

    Long doctorId,
    String doctorName,

    String specialization,

    LocalDateTime startDateTime,
    LocalDateTime endDateTime,

    String reason,

    AppointmentStatus status,

    LocalDateTime createdAt
) {
}