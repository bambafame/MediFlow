package com.mediflow.controller;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.appointment.CreateAppointmentRequest;
import com.mediflow.dto.appointment.RescheduleAppointmentRequest;
import com.mediflow.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

  private final AppointmentService appointmentService;

  public AppointmentController(AppointmentService appointmentService) {

    this.appointmentService = appointmentService;
  }

  @PostMapping
  public ResponseEntity<AppointmentResponse> bookAppointment(
      @Valid
      @RequestBody CreateAppointmentRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(appointmentService.bookAppointment(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable Long id) {

    return ResponseEntity.ok(appointmentService.getAppointment(id));
  }

  @GetMapping("/patient/{patientId}")
  public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(@PathVariable Long patientId) {

    return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
  }

  @GetMapping("/doctor/{doctorId}")
  public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(@PathVariable Long doctorId) {

    return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
  }

  @PutMapping("/{id}/reschedule")
  public ResponseEntity<AppointmentResponse> rescheduleAppointment(
      @PathVariable Long id,
      @Valid
      @RequestBody RescheduleAppointmentRequest request
  ) {

    return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, request));
  }

  @PatchMapping("/{id}/confirm")
  public ResponseEntity<AppointmentResponse> confirmAppointment(@PathVariable Long id) {

    return ResponseEntity.ok(appointmentService.confirmAppointment(id));
  }

  @PatchMapping("/{id}/cancel")
  public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable Long id) {

    return ResponseEntity.ok(appointmentService.cancelAppointment(id));
  }
}