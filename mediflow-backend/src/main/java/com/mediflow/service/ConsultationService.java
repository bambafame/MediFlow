package com.mediflow.service;

import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import com.mediflow.entity.Consultation;
import com.mediflow.exception.InvalidAppointmentException;
import com.mediflow.exception.ResourceNotFoundException;
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

  public Consultation createConsultation(
      Long appointmentId, String notes, String diagnosis)
  {

    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Appointment not found with id: " + appointmentId
                ));

    if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
      throw new InvalidAppointmentException(
          "Cannot create a consultation for a cancelled appointment"
      );
    }

    consultationRepository
        .findByAppointmentAppointmentId(appointmentId)
        .ifPresent(existing -> {
          throw new IllegalStateException(
              "Consultation already exists for this appointment"
          );
        });

    Consultation consultation = new Consultation();

    consultation.setAppointment(appointment);
    consultation.setNotes(notes);
    consultation.setDiagnosis(diagnosis);

    appointment.setStatus(AppointmentStatus.COMPLETED);

    appointmentRepository.save(appointment);

    return consultationRepository.save(consultation);
  }

  @Transactional(readOnly = true)
  public Consultation getByAppointment(Long appointmentId) {

    return consultationRepository
        .findByAppointmentAppointmentId(appointmentId)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "Consultation not found"
            ));
  }
}