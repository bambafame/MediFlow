package com.mediflow.mapper;

import com.mediflow.dto.doctor.DoctorResponse;
import com.mediflow.entity.Doctor;

public final class DoctorMapper {

  private DoctorMapper() {
  }

  public static DoctorResponse toResponse(Doctor doctor) {

    Long specializationId = null;
    String specializationName = null;

    if (doctor.getSpecialization() != null) {
      specializationId = doctor.getSpecialization().getSpecializationId();

      specializationName = doctor.getSpecialization().getName();
    }

    return new DoctorResponse(
        doctor.getUserId(),
        doctor.getUsername(),
        doctor.getEmail(),
        doctor.getPhoneNumber(),
        doctor.getFirstName(),
        doctor.getLastName(),
        doctor.getLicenseNumber(),
        doctor.getBio(),
        specializationId,
        specializationName,
        doctor.isEnabled()
    );
  }
}