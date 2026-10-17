package com.mediflow.service;

import com.mediflow.dto.DashboardResponse;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.patient.PatientResponse;
import com.mediflow.entity.AppointmentStatus;

import com.mediflow.entity.User;
import com.mediflow.exception.AccessDeniedException;
import com.mediflow.mapper.AppointmentMapper;
import com.mediflow.mapper.PatientMapper;

import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.PatientRepository;

import com.mediflow.security.AuthorizationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Service
@Transactional(readOnly = true)
public class DashboardService {

  private final PatientRepository patientRepository;

  private final DoctorRepository doctorRepository;

  private final AppointmentRepository appointmentRepository;

  private final AuthorizationService authorizationService;


  public DashboardService(
      PatientRepository patientRepository,
      DoctorRepository doctorRepository,
      AppointmentRepository appointmentRepository,
      AuthorizationService authorizationService
  ) {

    this.patientRepository = patientRepository;

    this.doctorRepository = doctorRepository;

    this.appointmentRepository = appointmentRepository;
    this.authorizationService = authorizationService;
  }


  public DashboardResponse getDashboard() {

    User currentUser = authorizationService.getCurrentUser();

    if (currentUser == null) {

      throw new AccessDeniedException("Authentication required.");
    }


    return switch (currentUser.getRole()) {

      case ADMIN, RECEPTIONIST -> getClinicDashboard(currentUser);

      case DOCTOR -> getDoctorDashboard(currentUser);

      case PATIENT -> getPatientDashboard(currentUser);
    };
  }

  private DashboardResponse getClinicDashboard(User currentUser) {

    LocalDate today = LocalDate.now();

    LocalDateTime startOfDay = today.atStartOfDay();

    LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();


    long totalPatients = patientRepository.count();

    long totalDoctors = doctorRepository.count();

    long totalAppointments = appointmentRepository.count();


    long scheduledAppointments = appointmentRepository
        .countByStatus(AppointmentStatus.SCHEDULED);

    long confirmedAppointments = appointmentRepository
        .countByStatus(AppointmentStatus.CONFIRMED);

    long completedAppointments = appointmentRepository
        .countByStatus(AppointmentStatus.COMPLETED);

    long cancelledAppointments = appointmentRepository
        .countByStatus(AppointmentStatus.CANCELLED);


    List<AppointmentResponse> todayAppointments = appointmentRepository
        .findByStartDateTimeBetweenOrderByStartDateTimeAsc(
            startOfDay, endOfDay
        )
        .stream()
        .map(AppointmentMapper::toResponse)
        .toList();


    List<AppointmentResponse> upcomingAppointments = appointmentRepository
        .findTop10ByStartDateTimeAfterAndStatusNotOrderByStartDateTimeAsc(
            LocalDateTime.now(), AppointmentStatus.CANCELLED
        )
        .stream()
        .map(AppointmentMapper::toResponse)
        .toList();


    List<PatientResponse> recentPatients = patientRepository
        .findTop5ByOrderByCreatedAtDesc()
        .stream()
        .map(PatientMapper::toResponse)
        .toList();


    return new DashboardResponse(
        currentUser.getRole().name(),
        totalPatients,
        totalDoctors,
        totalAppointments,
        scheduledAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todayAppointments,
        upcomingAppointments,
        recentPatients
    );
  }

  private DashboardResponse getDoctorDashboard(User currentUser) {

    Long doctorId = currentUser.getUserId();


    LocalDate today = LocalDate.now();

    LocalDateTime startOfDay = today.atStartOfDay();

    LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();


    long totalAppointments = appointmentRepository.countByDoctorUserId(doctorId);


    long scheduledAppointments = appointmentRepository
        .countByDoctorUserIdAndStatus(
            doctorId, AppointmentStatus.SCHEDULED
        );


    long confirmedAppointments = appointmentRepository
        .countByDoctorUserIdAndStatus(doctorId, AppointmentStatus.CONFIRMED);


    long completedAppointments = appointmentRepository
        .countByDoctorUserIdAndStatus(doctorId, AppointmentStatus.COMPLETED);


    long cancelledAppointments = appointmentRepository
        .countByDoctorUserIdAndStatus(doctorId, AppointmentStatus.CANCELLED);


    List<AppointmentResponse> todayAppointments = appointmentRepository
        .findByDoctorUserIdAndStartDateTimeBetweenOrderByStartDateTimeAsc(
            doctorId, startOfDay, endOfDay
        ).stream()
        .map(AppointmentMapper::toResponse)
        .toList();


    List<AppointmentResponse> upcomingAppointments = appointmentRepository
        .findTop10ByDoctorUserIdAndStartDateTimeAfterAndStatusNotOrderByStartDateTimeAsc(
            doctorId, LocalDateTime.now(), AppointmentStatus.CANCELLED
        ).stream()
        .map(AppointmentMapper::toResponse)
        .toList();


    return new DashboardResponse(
        "DOCTOR",
        null,
        null,
        totalAppointments,
        scheduledAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todayAppointments,
        upcomingAppointments,
        List.of()
    );
  }

  private DashboardResponse getPatientDashboard(User currentUser) {

    Long patientId = currentUser.getUserId();


    LocalDate today = LocalDate.now();

    LocalDateTime startOfDay = today.atStartOfDay();

    LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();


    long totalAppointments = appointmentRepository.countByPatientUserId(patientId);


    long scheduledAppointments = appointmentRepository
        .countByPatientUserIdAndStatus(patientId, AppointmentStatus.SCHEDULED);


    long confirmedAppointments = appointmentRepository
        .countByPatientUserIdAndStatus(patientId, AppointmentStatus.CONFIRMED);


    long completedAppointments = appointmentRepository
        .countByPatientUserIdAndStatus(patientId, AppointmentStatus.COMPLETED);


    long cancelledAppointments = appointmentRepository
        .countByPatientUserIdAndStatus(
            patientId, AppointmentStatus.CANCELLED
        );


    List<AppointmentResponse> todayAppointments = appointmentRepository
        .findByPatientUserIdAndStartDateTimeBetweenOrderByStartDateTimeAsc(
            patientId, startOfDay, endOfDay
        ).stream()
        .map(AppointmentMapper::toResponse)
        .toList();


    List<AppointmentResponse> upcomingAppointments = appointmentRepository
        .findTop10ByPatientUserIdAndStartDateTimeAfterAndStatusNotOrderByStartDateTimeAsc(
            patientId, LocalDateTime.now(), AppointmentStatus.CANCELLED
        ).stream()
        .map(AppointmentMapper::toResponse)
        .toList();


    return new DashboardResponse(
        "PATIENT",
        null,
        null,
        totalAppointments,
        scheduledAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todayAppointments,
        upcomingAppointments,
        List.of()
    );
  }
}