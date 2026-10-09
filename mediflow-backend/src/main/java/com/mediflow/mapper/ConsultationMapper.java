package com.mediflow.mapper;

import com.mediflow.dto.consultation.ConsultationResponse;
import com.mediflow.entity.Consultation;

public final class ConsultationMapper {

  private ConsultationMapper() {
  }

  public static ConsultationResponse toResponse(
      Consultation consultation) {

    return new ConsultationResponse(
        consultation.getConsultationId(),
        consultation.getAppointment().getAppointmentId(),
        consultation.getNotes(),
        consultation.getDiagnosis(),
        consultation.getCreatedAt()
    );
  }
}