package com.mediflow.service;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.appointment.CreateAppointmentRequest;
import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import com.mediflow.entity.Availability;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Patient;
import com.mediflow.entity.Role;
import com.mediflow.entity.User;
import com.mediflow.exception.InvalidAppointmentException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.AvailabilityRepository;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.PatientRepository;
import com.mediflow.security.AuthorizationService;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

  @Mock
  private AppointmentRepository appointmentRepository;

  @Mock
  private PatientRepository patientRepository;

  @Mock
  private DoctorRepository doctorRepository;

  @Mock
  private AuthorizationService authorizationService;

  @Mock
  private AvailabilityRepository availabilityRepository;

  @InjectMocks
  private AppointmentService appointmentService;

  private Patient patient;
  private Doctor doctor;

  @BeforeEach
  void setUp() {

    patient = new Patient();
    patient.setUserId(1L);
    patient.setFirstName("John");
    patient.setLastName("Smith");


    doctor = new Doctor();
    doctor.setUserId(2L);
    doctor.setFirstName("Sarah");
    doctor.setLastName("Wilson");
  }

  @Test
  void shouldReturnAppointmentById() {

    Appointment appointment = new Appointment();

    appointment.setAppointmentId(10L);
    appointment.setPatient(patient);
    appointment.setDoctor(doctor);
    appointment.setReason("Routine checkup");
    appointment.setStatus(AppointmentStatus.SCHEDULED);

    LocalDateTime start = LocalDateTime.of(
        2026, 10, 20, 10, 0
    );

    appointment.setStartDateTime(start);
    appointment.setEndDateTime(start.plusMinutes(30));


    when(appointmentRepository.findById(10L)).thenReturn(Optional.of(appointment));


    AppointmentResponse result = appointmentService.getAppointment(10L);


    assertNotNull(result);

    assertEquals(10L, result.appointmentId());

    assertEquals(1L, result.patientId());

    assertEquals("John Smith", result.patientName());

    assertEquals(2L, result.doctorId());

    assertEquals("Sarah Wilson", result.doctorName());

    assertEquals("Routine checkup", result.reason());

    assertEquals(AppointmentStatus.SCHEDULED, result.status());


    verify(appointmentRepository).findById(10L);

    verifyNoMoreInteractions(appointmentRepository);
  }

  @Test
  void shouldThrowExceptionWhenAppointmentDoesNotExist() {

    when(appointmentRepository.findById(99L)).thenReturn(Optional.empty());

    assertThrows(
        ResourceNotFoundException.class,
        () -> appointmentService.getAppointment(99L)
    );

    verify(appointmentRepository).findById(99L);

  }

  @Test
  void shouldCreateAppointment() {

    LocalDateTime start = LocalDateTime.now().plusDays(2)
        .withHour(10).withMinute(0)
        .withSecond(0).withNano(0);

    LocalDateTime end = start.plusMinutes(30);

    CreateAppointmentRequest request = new CreateAppointmentRequest(
        1L, 2L, start, end, "Routine checkup"
    );

    Availability availability = new Availability();

    availability.setDoctor(doctor);
    availability.setDayOfWeek(start.getDayOfWeek());
    availability.setStartTime(LocalTime.of(9, 0));
    availability.setEndTime(LocalTime.of(17, 0));
    availability.setAvailable(true);


    User currentUser = new User() {};

    currentUser.setUserId(99L);
    currentUser.setRole(Role.ADMIN);


    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    when(doctorRepository.findById(2L)).thenReturn(Optional.of(doctor));

    when(authorizationService.getCurrentUser()).thenReturn(currentUser);

    when(availabilityRepository
        .findByDoctorUserIdAndDayOfWeek(2L, start.getDayOfWeek())
    ).thenReturn(List.of(availability));

    when(appointmentRepository
        .findOverlappingAppointments(2L, start, end)
    ).thenReturn(List.of());

    when(appointmentRepository
        .findPatientOverlappingAppointments(1L, start, end)
    ).thenReturn(List.of());


    when(appointmentRepository.save(any(Appointment.class))
    ).thenAnswer(invocation -> {
      Appointment appointment = invocation.getArgument(0);

      appointment.setAppointmentId(100L);

      return appointment;
    });


    AppointmentResponse result = appointmentService.bookAppointment(request);


    assertNotNull(result);

    assertEquals(100L, result.appointmentId());

    assertEquals(1L, result.patientId());

    assertEquals("John Smith", result.patientName());

    assertEquals(2L, result.doctorId());

    assertEquals("Sarah Wilson", result.doctorName());

    assertEquals(start, result.startDateTime());

    assertEquals(end, result.endDateTime());

    assertEquals("Routine checkup", result.reason());

    assertEquals(AppointmentStatus.SCHEDULED, result.status());

    verify(patientRepository).findById(1L);

    verify(doctorRepository).findById(2L);

    verify(authorizationService).getCurrentUser();

    verify(availabilityRepository)
        .findByDoctorUserIdAndDayOfWeek(2L, start.getDayOfWeek()
    );

    verify(appointmentRepository)
        .findOverlappingAppointments(2L, start, end);

    verify(appointmentRepository)
        .findPatientOverlappingAppointments(1L, start, end);

    verify(appointmentRepository).save(any(Appointment.class));
  }

  @Test
  void shouldRejectAppointmentWhenEndTimeIsBeforeStartTime() {

    LocalDateTime start = LocalDateTime.now().plusDays(2)
        .withHour(10).withMinute(0)
        .withSecond(0).withNano(0);

    LocalDateTime end = start.minusMinutes(30);

    CreateAppointmentRequest request = new CreateAppointmentRequest(
        1L, 2L, start,end, "Routine checkup"
    );

    when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

    when(doctorRepository.findById(2L)).thenReturn(Optional.of(doctor));

    when(authorizationService.getCurrentUser()).thenReturn(null);


    InvalidAppointmentException exception = assertThrows(
        InvalidAppointmentException.class,
        () -> appointmentService.bookAppointment(request)
    );


    assertEquals(
        "Appointment start time must be before end time",
        exception.getMessage()
    );


    verify(patientRepository).findById(1L);

    verify(doctorRepository).findById(2L);

    verify(authorizationService).getCurrentUser();


    /*
     * Since time validation fails first,
     * availability and conflict checks
     * must never happen.
     */
    verifyNoInteractions(availabilityRepository);

    verify(appointmentRepository, never())
        .findOverlappingAppointments(anyLong(), any(), any());

    verify(appointmentRepository, never())
        .findPatientOverlappingAppointments(anyLong(), any(), any());

    verify(appointmentRepository, never())
        .save(any(Appointment.class));
  }
}