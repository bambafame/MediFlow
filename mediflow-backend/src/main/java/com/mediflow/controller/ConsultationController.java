package com.mediflow.controller;

import com.mediflow.dto.consultation.CreateConsultationRequest;
import com.mediflow.dto.consultation.ConsultationResponse;
import com.mediflow.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

  private final ConsultationService consultationService;

  public ConsultationController(ConsultationService consultationService) {

    this.consultationService = consultationService;
  }

  @PreAuthorize(
      "hasRole('ADMIN') or @authorizationService.isDoctorOfAppointment(#request.appointmentId())"
  )
  @PostMapping
  public ResponseEntity<ConsultationResponse> createConsultation(
      @Valid
      @RequestBody CreateConsultationRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(consultationService.createConsultation(request));
  }

  @PreAuthorize(
      "hasRole('ADMIN') " +
          "or @authorizationService.isDoctorOfAppointment(#appointmentId) " +
          "or @authorizationService.isPatientOfAppointment(#appointmentId)"
  )
  @GetMapping("/appointment/{appointmentId}")
  public ResponseEntity<ConsultationResponse> getByAppointment(
      @PathVariable Long appointmentId
  ) {

    return ResponseEntity.ok(consultationService.getByAppointment(appointmentId));
  }
}