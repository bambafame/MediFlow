package com.mediflow.repository;

import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository
    extends JpaRepository<Appointment, Long> {

  List<Appointment> findByPatientUserId(Long patientId);

  List<Appointment> findByDoctorUserId(Long doctorId);

  List<Appointment> findByStatus(AppointmentStatus status);

  @Query("""
        SELECT a
        FROM Appointment a
        WHERE a.doctor.userId = :doctorId
          AND a.status <> com.mediflow.entity.AppointmentStatus.CANCELLED
          AND a.startDateTime < :endDateTime
          AND a.endDateTime > :startDateTime
        """)
  List<Appointment> findOverlappingAppointments(
      @Param("doctorId") Long doctorId,
      @Param("startDateTime") LocalDateTime startDateTime,
      @Param("endDateTime") LocalDateTime endDateTime
  );

  @Query("""
        SELECT a
        FROM Appointment a
        WHERE a.doctor.userId = :doctorId
          AND a.appointmentId <> :appointmentId
          AND a.status <> com.mediflow.entity.AppointmentStatus.CANCELLED
          AND a.startDateTime < :endDateTime
          AND a.endDateTime > :startDateTime
        """)
  List<Appointment> findOverlappingAppointmentsExcluding(
      @Param("doctorId") Long doctorId,
      @Param("appointmentId") Long appointmentId,
      @Param("startDateTime") LocalDateTime startDateTime,
      @Param("endDateTime") LocalDateTime endDateTime
  );

  // --------------------------------------------------
  // Patient overlap validation
  // --------------------------------------------------

  @Query("""
        SELECT a
        FROM Appointment a
        WHERE a.patient.userId = :patientId
          AND a.status <> com.mediflow.entity.AppointmentStatus.CANCELLED
          AND a.startDateTime < :endDateTime
          AND a.endDateTime > :startDateTime
        """)
  List<Appointment> findPatientOverlappingAppointments(
      @Param("patientId") Long patientId,
      @Param("startDateTime") LocalDateTime startDateTime,
      @Param("endDateTime") LocalDateTime endDateTime
  );

  @Query("""
        SELECT a
        FROM Appointment a
        WHERE a.patient.userId = :patientId
          AND a.appointmentId <> :appointmentId
          AND a.status <> com.mediflow.entity.AppointmentStatus.CANCELLED
          AND a.startDateTime < :endDateTime
          AND a.endDateTime > :startDateTime
        """)
  List<Appointment> findPatientOverlappingAppointmentsExcluding(
      @Param("patientId") Long patientId,
      @Param("appointmentId") Long appointmentId,
      @Param("startDateTime") LocalDateTime startDateTime,
      @Param("endDateTime") LocalDateTime endDateTime
  );
}