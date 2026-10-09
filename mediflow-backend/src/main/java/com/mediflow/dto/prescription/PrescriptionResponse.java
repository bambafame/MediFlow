package com.mediflow.dto.prescription;

import java.time.LocalDate;

public record PrescriptionResponse(

    Long prescriptionId,
    Long consultationId,
    String medicationName,
    String dosage,
    String instructions,
    LocalDate prescribedDate
) {
}