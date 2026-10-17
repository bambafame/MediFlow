package com.mediflow.security;

import com.mediflow.entity.Appointment;
import com.mediflow.entity.Role;
import com.mediflow.entity.User;
import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.ConsultationRepository;
import com.mediflow.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
public class AuthorizationService {

  private final UserRepository userRepository;
  private final AppointmentRepository appointmentRepository;
  private final ConsultationRepository consultationRepository;


  public AuthorizationService(
      UserRepository userRepository,
      AppointmentRepository appointmentRepository,
      ConsultationRepository consultationRepository
  ) {
    this.userRepository = userRepository;
    this.appointmentRepository = appointmentRepository;
    this.consultationRepository = consultationRepository;
  }


  /*
   * Return the currently authenticated
   * MediFlow user.
   */
  public User getCurrentUser() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      return null;
    }


    return userRepository
        .findByUsername(authentication.getName())
        .orElse(null);
  }


  /*
   * Is this ID the logged-in user's ID?
   *
   * Useful for Patient profile access.
   */
  public boolean isCurrentUser(Long userId) {

    User user = getCurrentUser();

    return user != null && user.getUserId().equals(userId);
  }


  /*
   * Patient owns appointment when:
   *
   * logged-in user ID ==
   * appointment.patient.userId
   */
  public boolean isPatientOfAppointment(Long appointmentId) {

    User user = getCurrentUser();

    if (user == null || user.getRole() != Role.PATIENT) {
      return false;
    }


    return appointmentRepository
        .findById(appointmentId)
        .map(appointment ->
                appointment.getPatient().getUserId().equals(user.getUserId())
        )
        .orElse(false);
  }


  /*
   * Doctor owns appointment when:
   *
   * logged-in user ID ==
   * appointment.doctor.userId
   */
  public boolean isDoctorOfAppointment(Long appointmentId) {

    User user = getCurrentUser();

    if (user == null || user.getRole() != Role.DOCTOR) {
      return false;
    }

    return appointmentRepository
        .findById(appointmentId)
        .map(appointment ->
                appointment.getDoctor().getUserId().equals(user.getUserId())
        )
        .orElse(false);
  }


  /*
   * Generic appointment access:
   *
   * assigned patient OR assigned doctor
   */
  public boolean canAccessAppointment(Long appointmentId) {

    User user = getCurrentUser();

    if (user == null) {
      return false;
    }


    Appointment appointment = appointmentRepository
        .findById(appointmentId).orElse(null);


    if (appointment == null) {
      return false;
    }


    if (user.getRole() == Role.PATIENT) {

      return appointment.getPatient()
          .getUserId().equals(user.getUserId());
    }


    if (user.getRole() == Role.DOCTOR) {

      return appointment.getDoctor()
          .getUserId().equals(user.getUserId());
    }


    return false;
  }


  /*
   * Used by:
   *
   * /appointments/patient/{patientId}
   * /prescriptions/patient/{patientId}
   */
  public boolean isCurrentPatient(Long patientId) {

    User user = getCurrentUser();

    return user != null
        &&
        user.getRole() == Role.PATIENT
        &&
        user.getUserId().equals(patientId);
  }


  /*
   * Used by:
   *
   * /appointments/doctor/{doctorId}
   */
  public boolean isCurrentDoctor(Long doctorId) {

    User user = getCurrentUser();

    return user != null
        &&
        user.getRole() == Role.DOCTOR
        &&
        user.getUserId().equals(doctorId);
  }

  public boolean canPrescribeForConsultation(Long consultationId) {

    User user = getCurrentUser();

    if (user == null) {
      return false;
    }

    if (user.getRole() == Role.ADMIN) {
      return true;
    }

    if (user.getRole() != Role.DOCTOR) {
      return false;
    }

    return consultationRepository.findById(consultationId)
        .map(consultation ->
            consultation.getAppointment()
                .getDoctor().getUserId()
                .equals(user.getUserId())
        ).orElse(false);
  }

  public boolean canAccessConsultation(Long consultationId) {

    User user = getCurrentUser();

    if (user == null) {
      return false;
    }

    return consultationRepository.findById(consultationId)
        .map(consultation -> {

              Long patientId = consultation
                  .getAppointment()
                  .getPatient()
                  .getUserId();

              Long doctorId = consultation
                  .getAppointment()
                  .getDoctor()
                  .getUserId();

              if (user.getRole() == Role.DOCTOR) {
                return user.getUserId().equals(doctorId);
              }

              if (user.getRole() == Role.PATIENT) {
                return user.getUserId().equals(patientId);
              }

              return false;
            }
        )
        .orElse(false);
  }
}