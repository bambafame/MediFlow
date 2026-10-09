package com.mediflow.mapper;

import com.mediflow.dto.patient.PatientResponse;
import com.mediflow.entity.Patient;

public final class PatientMapper {

  private PatientMapper() {
  }

  public static PatientResponse toResponse(Patient patient) {

    return new PatientResponse(
        patient.getUserId(),
        patient.getUsername(),
        patient.getEmail(),
        patient.getPhoneNumber(),
        patient.getFirstName(),
        patient.getLastName(),
        patient.getDateOfBirth(),
        patient.getAge(),
        patient.getMailingAddress(),
        patient.isEnabled()
    );
  }
}