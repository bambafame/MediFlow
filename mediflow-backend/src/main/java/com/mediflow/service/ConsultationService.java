package com.mediflow.service;

import com.mediflow.dto.consultation.ConsultationResponse;
import com.mediflow.dto.consultation.CreateConsultationRequest;
import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import com.mediflow.entity.Consultation;
import com.mediflow.entity.Role;
import com.mediflow.entity.User;
import com.mediflow.exception.InvalidAppointmentException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.ConsultationMapper;
import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.ConsultationRepository;
import com.mediflow.exception.AccessDeniedException;
import com.mediflow.security.AuthorizationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ConsultationService {

  private final ConsultationRepository consultationRepository;
  private final AppointmentRepository appointmentRepository;
  private final AuthorizationService authorizationService;

  public ConsultationService(
      ConsultationRepository consultationRepository,
      AppointmentRepository appointmentRepository,
      AuthorizationService authorizationService
  ) {
    this.consultationRepository = consultationRepository;
    this.appointmentRepository = appointmentRepository;
    this.authorizationService = authorizationService;
  }

  public ConsultationResponse createConsultation(CreateConsultationRequest request) {

    Appointment appointment = appointmentRepository.findById(request.appointmentId())
        .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

    if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
      throw new InvalidAppointmentException("Cannot create consultation for cancelled appointment");
    }

    User currentUser = authorizationService.getCurrentUser();

    if (currentUser.getRole() == Role.DOCTOR
            && !appointment.getDoctor().getUserId().equals(currentUser.getUserId())
    ) {

      throw new AccessDeniedException(
          "You are not assigned to this appointment."
      );
    }

    consultationRepository
        .findByAppointmentAppointmentId(request.appointmentId())
        .ifPresent(existing -> {
          throw new IllegalStateException("Consultation already exists");
        });

    Consultation consultation = new Consultation();

    consultation.setAppointment(appointment);
    consultation.setNotes(request.notes());
    consultation.setDiagnosis(request.diagnosis());

    appointment.setStatus(AppointmentStatus.COMPLETED);

    appointmentRepository.save(appointment);

    Consultation saved = consultationRepository.save(consultation);

    return ConsultationMapper.toResponse(saved);
  }

  @Transactional(readOnly = true)
  public ConsultationResponse getByAppointment(Long appointmentId) {

    Consultation consultation = consultationRepository
            .findByAppointmentAppointmentId(appointmentId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Consultation not found")
            );

    return ConsultationMapper.toResponse(consultation);
  }
}