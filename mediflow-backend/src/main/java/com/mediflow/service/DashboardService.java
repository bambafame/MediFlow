package com.mediflow.service;

import com.mediflow.dto.DashboardResponse;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.patient.PatientResponse;
import com.mediflow.entity.AppointmentStatus;

import com.mediflow.mapper.AppointmentMapper;
import com.mediflow.mapper.PatientMapper;

import com.mediflow.repository.AppointmentRepository;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.PatientRepository;

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


  public DashboardService(
      PatientRepository patientRepository,
      DoctorRepository doctorRepository,
      AppointmentRepository appointmentRepository
  ) {

    this.patientRepository = patientRepository;

    this.doctorRepository = doctorRepository;

    this.appointmentRepository = appointmentRepository;
  }


  public DashboardResponse getDashboard() {

    LocalDate today = LocalDate.now();

    LocalDateTime startOfDay = today.atStartOfDay();

    LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();


    List<AppointmentResponse> todayAppointments = appointmentRepository
            .findByStartDateTimeBetweenOrderByStartDateTimeAsc(
                startOfDay,
                endOfDay
            )
            .stream()
            .map(AppointmentMapper::toResponse)
            .toList();


    List<AppointmentResponse> upcomingAppointments = appointmentRepository
            .findTop10ByStartDateTimeAfterAndStatusNotOrderByStartDateTimeAsc(
                LocalDateTime.now(),
                AppointmentStatus.CANCELLED
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

        patientRepository.count(),

        doctorRepository.count(),

        appointmentRepository.count(),

        appointmentRepository.countByStatus(AppointmentStatus.SCHEDULED),

        appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED),

        appointmentRepository.countByStatus(AppointmentStatus.COMPLETED),

        appointmentRepository.countByStatus(AppointmentStatus.CANCELLED),

        todayAppointments,

        upcomingAppointments,

        recentPatients
    );
  }
}