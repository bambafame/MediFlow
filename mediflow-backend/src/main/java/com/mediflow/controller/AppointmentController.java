package com.mediflow.controller;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.appointment.CreateAppointmentRequest;
import com.mediflow.dto.appointment.RescheduleAppointmentRequest;
import com.mediflow.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

  private final AppointmentService appointmentService;

  public AppointmentController(AppointmentService appointmentService) {

    this.appointmentService = appointmentService;
  }

  @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','PATIENT')")
  @PostMapping
  public ResponseEntity<AppointmentResponse> bookAppointment(
      @Valid
      @RequestBody CreateAppointmentRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(appointmentService.bookAppointment(request));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.canAccessAppointment(#id)"
  )
  @GetMapping("/{id}")
  public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable Long id) {

    return ResponseEntity.ok(appointmentService.getAppointment(id));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isCurrentPatient(#patientId)"
  )
  @GetMapping("/patient/{patientId}")
  public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(@PathVariable Long patientId) {

    return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isCurrentDoctor(#doctorId)"
  )
  @GetMapping("/doctor/{doctorId}")
  public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(@PathVariable Long doctorId) {

    return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isPatientOfAppointment(#id)"
  )
  @PutMapping("/{id}/reschedule")
  public ResponseEntity<AppointmentResponse> rescheduleAppointment(
      @PathVariable Long id,
      @Valid
      @RequestBody RescheduleAppointmentRequest request
  ) {

    return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, request));
  }

  @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
  @PatchMapping("/{id}/confirm")
  public ResponseEntity<AppointmentResponse> confirmAppointment(@PathVariable Long id) {

    return ResponseEntity.ok(appointmentService.confirmAppointment(id));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isPatientOfAppointment(#id)"
  )
  @PatchMapping("/{id}/cancel")
  public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable Long id) {

    return ResponseEntity.ok(appointmentService.cancelAppointment(id));
  }

  @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
  @GetMapping
  public List<AppointmentResponse> getAllAppointments() {

    return appointmentService.getAllAppointments();
  }
}