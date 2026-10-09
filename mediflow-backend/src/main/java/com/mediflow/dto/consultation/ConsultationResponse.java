package com.mediflow.dto.consultation;

import java.time.LocalDateTime;

public record ConsultationResponse(

    Long consultationId,
    Long appointmentId,
    String notes,
    String diagnosis,
    LocalDateTime createdAt
) {
}