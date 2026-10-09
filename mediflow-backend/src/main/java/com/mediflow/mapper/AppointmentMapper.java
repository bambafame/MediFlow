package com.mediflow.mapper;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.entity.Appointment;

public final class AppointmentMapper {

  private AppointmentMapper() {
  }

  public static AppointmentResponse toResponse(
      Appointment appointment) {

    String patientName =
        appointment.getPatient().getFirstName()
            + " " + appointment.getPatient().getLastName();

    String doctorName =
        appointment.getDoctor().getFirstName()
            + " " + appointment.getDoctor().getLastName();

    String specializationName = null;

    if (appointment.getDoctor().getSpecialization() != null) {
      specializationName = appointment
              .getDoctor()
              .getSpecialization()
              .getName();
    }

    return new AppointmentResponse(
        appointment.getAppointmentId(),
        appointment.getPatient().getUserId(),
        patientName,
        appointment.getDoctor().getUserId(),
        doctorName,
        specializationName,
        appointment.getStartDateTime(),
        appointment.getEndDateTime(),
        appointment.getReason(),
        appointment.getStatus(),
        appointment.getCreatedAt()
    );
  }
}