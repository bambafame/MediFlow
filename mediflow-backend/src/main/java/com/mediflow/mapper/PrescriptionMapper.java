package com.mediflow.mapper;

import com.mediflow.dto.prescription.PrescriptionResponse;
import com.mediflow.entity.Prescription;

public final class PrescriptionMapper {

  private PrescriptionMapper() {
  }

  public static PrescriptionResponse toResponse(
      Prescription prescription) {

    return new PrescriptionResponse(
        prescription.getPrescriptionId(),
        prescription.getConsultation().getConsultationId(),
        prescription.getMedicationName(),
        prescription.getDosage(),
        prescription.getInstructions(),
        prescription.getPrescribedDate()
    );
  }
}