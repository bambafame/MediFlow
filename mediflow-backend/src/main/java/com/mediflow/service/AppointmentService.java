package com.mediflow.service;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.appointment.CreateAppointmentRequest;
import com.mediflow.dto.appointment.RescheduleAppointmentRequest;
import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import com.mediflow.entity.Availability;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Patient;
import com.mediflow.exception.AppointmentConflictException;
import com.mediflow.exception.InvalidAppointmentException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.AppointmentMapper;
import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.AvailabilityRepository;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class AppointmentService {

  private final AppointmentRepository appointmentRepository;
  private final PatientRepository patientRepository;
  private final DoctorRepository doctorRepository;
  private final AvailabilityRepository availabilityRepository;

  public AppointmentService(
      AppointmentRepository appointmentRepository,
      PatientRepository patientRepository,
      DoctorRepository doctorRepository,
      AvailabilityRepository availabilityRepository)
  {
    this.appointmentRepository = appointmentRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
    this.availabilityRepository = availabilityRepository;
  }

  public AppointmentResponse bookAppointment(CreateAppointmentRequest request) {

    Long patientId = request.patientId();
    Long doctorId = request.doctorId();

    Patient patient = patientRepository.findById(patientId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Patient not found with id: " + patientId)
        );

    Doctor doctor = doctorRepository.findById(doctorId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Doctor not found with id: " + doctorId)
        );

    validateSchedulingRules(
        patientId,
        doctorId,
        request.startDateTime(),
        request.endDateTime(),
        null
    );

    Appointment appointment = new Appointment();

    appointment.setPatient(patient);
    appointment.setDoctor(doctor);
    appointment.setStartDateTime(request.startDateTime());
    appointment.setEndDateTime(request.endDateTime());
    appointment.setReason(request.reason());
    appointment.setStatus(AppointmentStatus.SCHEDULED);

    Appointment saved = appointmentRepository.save(appointment);

    return AppointmentMapper.toResponse(saved);
  }

  public AppointmentResponse rescheduleAppointment(
      Long appointmentId,
      RescheduleAppointmentRequest request) {

    Appointment appointment = findAppointment(appointmentId);

    if (appointment.getStatus() == AppointmentStatus.CANCELLED) {

      throw new InvalidAppointmentException(
          "Cancelled appointments cannot be rescheduled"
      );
    }

    if (appointment.getStatus() == AppointmentStatus.COMPLETED) {

      throw new InvalidAppointmentException(
          "Completed appointments cannot be rescheduled"
      );
    }

    Long patientId = appointment.getPatient().getUserId();

    Long doctorId = appointment.getDoctor().getUserId();

    validateSchedulingRules(
        patientId,
        doctorId,
        request.startDateTime(),
        request.endDateTime(),
        appointmentId
    );

    appointment.setStartDateTime(request.startDateTime());

    appointment.setEndDateTime(request.endDateTime());

    return AppointmentMapper.toResponse(appointmentRepository.save(appointment));
  }

  @Transactional(readOnly = true)
  public AppointmentResponse getAppointment(Long id) {

    return AppointmentMapper.toResponse(findAppointment(id));
  }

  @Transactional(readOnly = true)
  public List<AppointmentResponse> getPatientAppointments(Long patientId) {

    return appointmentRepository
        .findByPatientUserId(patientId)
        .stream()
        .map(AppointmentMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<AppointmentResponse> getDoctorAppointments(Long doctorId) {

    return appointmentRepository
        .findByDoctorUserId(doctorId)
        .stream()
        .map(AppointmentMapper::toResponse)
        .toList();
  }

  public AppointmentResponse cancelAppointment(
      Long id) {

    Appointment appointment = findAppointment(id);

    if (appointment.getStatus() == AppointmentStatus.COMPLETED) {

      throw new InvalidAppointmentException("Completed appointments cannot be cancelled");
    }

    if (appointment.getStatus() == AppointmentStatus.CANCELLED) {

      throw new InvalidAppointmentException("Appointment is already cancelled");
    }

    appointment.setStatus(
        AppointmentStatus.CANCELLED
    );

    return AppointmentMapper.toResponse(
        appointmentRepository.save(
            appointment
        )
    );
  }

  public AppointmentResponse confirmAppointment(Long id) {

    Appointment appointment = findAppointment(id);

    if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {

      throw new InvalidAppointmentException("Only scheduled appointments can be confirmed");
    }

    appointment.setStatus(AppointmentStatus.CONFIRMED);

    return AppointmentMapper.toResponse(appointmentRepository.save(appointment));
  }

  private void validateSchedulingRules(
      Long patientId,
      Long doctorId,
      LocalDateTime startDateTime,
      LocalDateTime endDateTime,
      Long excludedAppointmentId) {

    validateAppointmentTime(startDateTime, endDateTime);

    validateDoctorAvailability(doctorId, startDateTime, endDateTime);

    validateDoctorNoOverlap(
        doctorId,
        startDateTime,
        endDateTime,
        excludedAppointmentId
    );

    validatePatientNoOverlap(
        patientId,
        startDateTime,
        endDateTime,
        excludedAppointmentId
    );
  }

  private void validateAppointmentTime(LocalDateTime startDateTime, LocalDateTime endDateTime) {

    if (startDateTime == null || endDateTime == null) {
      throw new InvalidAppointmentException(
          "Appointment start and end times are required"
      );
    }

    if (!startDateTime.isBefore(endDateTime)) {
      throw new InvalidAppointmentException(
          "Appointment start time must be before end time"
      );
    }

    if (startDateTime.isBefore(LocalDateTime.now())) {
      throw new InvalidAppointmentException(
          "Appointment cannot be booked in the past"
      );
    }

    if (!startDateTime.toLocalDate().equals(endDateTime.toLocalDate())) {

      throw new InvalidAppointmentException(
          "Appointment must start and end on the same day"
      );
    }
  }

  private void validateDoctorAvailability(
      Long doctorId,
      LocalDateTime startDateTime,
      LocalDateTime endDateTime)
  {

    DayOfWeek requestedDay = startDateTime.getDayOfWeek();

    List<Availability> availabilities = availabilityRepository
            .findByDoctorUserIdAndDayOfWeek(doctorId, requestedDay);

    if (availabilities.isEmpty()) {
      throw new AppointmentConflictException(
          "Doctor has no availability configured for "+ requestedDay
      );
    }

    LocalTime requestedStart = startDateTime.toLocalTime();

    LocalTime requestedEnd = endDateTime.toLocalTime();

    boolean fitsInsideAvailability =
        availabilities.stream()
            .filter(Availability::isAvailable)
            .anyMatch(availability ->
                isInsideAvailability(
                    requestedStart,
                    requestedEnd,
                    availability
                )
            );

    if (!fitsInsideAvailability) {
      throw new AppointmentConflictException(
          "Requested appointment time is outside "
              + "the doctor's available hours"
      );
    }
  }

  private boolean isInsideAvailability(
      LocalTime requestedStart,
      LocalTime requestedEnd,
      Availability availability)
  {

    boolean startsAtOrAfterAvailability =
        !requestedStart.isBefore(availability.getStartTime());

    boolean endsAtOrBeforeAvailability =
        !requestedEnd.isAfter(availability.getEndTime());

    return startsAtOrAfterAvailability && endsAtOrBeforeAvailability;
  }

  private void validateDoctorNoOverlap(
      Long doctorId,
      LocalDateTime startDateTime,
      LocalDateTime endDateTime,
      Long excludedAppointmentId)
  {

    List<Appointment> conflicts;

    if (excludedAppointmentId == null) {

      conflicts = appointmentRepository
              .findOverlappingAppointments(
                  doctorId,
                  startDateTime,
                  endDateTime
              );

    } else {

      conflicts =
          appointmentRepository
              .findOverlappingAppointmentsExcluding(
                  doctorId,
                  excludedAppointmentId,
                  startDateTime,
                  endDateTime
              );
    }

    if (!conflicts.isEmpty()) {
      throw new AppointmentConflictException(
          "Doctor already has an appointment "
              + "during the requested time"
      );
    }
  }

  private void validatePatientNoOverlap(
      Long patientId,
      LocalDateTime startDateTime,
      LocalDateTime endDateTime,
      Long excludedAppointmentId)
  {

    List<Appointment> conflicts;

    if (excludedAppointmentId == null) {

      conflicts =
          appointmentRepository.findPatientOverlappingAppointments(
                  patientId,
                  startDateTime,
                  endDateTime
              );

    } else {

      conflicts =
          appointmentRepository.findPatientOverlappingAppointmentsExcluding(
                  patientId,
                  excludedAppointmentId,
                  startDateTime,
                  endDateTime
              );
    }

    if (!conflicts.isEmpty()) {
      throw new AppointmentConflictException(
          "Patient already has another appointment "
              + "during the requested time"
      );
    }
  }

  private Appointment findAppointment(Long id) {

    return appointmentRepository.findById(id)
        .orElseThrow(
            () -> new ResourceNotFoundException("Appointment not found with id: " + id)
        );
  }
}

/**
 * The service enforces the booking process in this order:
 * Patient exists
 *       ↓
 * Doctor exists
 *       ↓
 * Start/end times valid
 *       ↓
 * Appointment is not in the past
 *       ↓
 * Same-day appointment
 *       ↓
 * Requested time inside doctor's availability
 *       ↓
 * Doctor has no overlapping appointment
 *       ↓
 * Patient has no overlapping appointment
 *       ↓
 * SAVE
 */