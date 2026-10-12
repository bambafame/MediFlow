package com.mediflow.service;

import com.mediflow.dto.consultation.ConsultationResponse;
import com.mediflow.dto.consultation.CreateConsultationRequest;
import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import com.mediflow.entity.Consultation;
import com.mediflow.exception.InvalidAppointmentException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.ConsultationMapper;
import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.ConsultationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ConsultationService {

  private final ConsultationRepository consultationRepository;
  private final AppointmentRepository appointmentRepository;

  public ConsultationService(
      ConsultationRepository consultationRepository,
      AppointmentRepository appointmentRepository)
  {
    this.consultationRepository = consultationRepository;
    this.appointmentRepository = appointmentRepository;
  }

  public ConsultationResponse createConsultation(CreateConsultationRequest request) {

    Appointment appointment = appointmentRepository.findById(request.appointmentId())
        .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

    if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
      throw new InvalidAppointmentException("Cannot create consultation for cancelled appointment");
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