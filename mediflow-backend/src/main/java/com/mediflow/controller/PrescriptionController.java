package com.mediflow.controller;

import com.mediflow.dto.prescription.CreatePrescriptionRequest;
import com.mediflow.dto.prescription.PrescriptionResponse;
import com.mediflow.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

  private final PrescriptionService prescriptionService;

  public PrescriptionController(PrescriptionService prescriptionService) {

    this.prescriptionService = prescriptionService;
  }

  @PreAuthorize(
      "@authorizationService.canPrescribeForConsultation(#request.consultationId())"
  )
  @PostMapping
  public ResponseEntity<PrescriptionResponse> createPrescription(
      @Valid @RequestBody CreatePrescriptionRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(prescriptionService.createPrescription(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<PrescriptionResponse> getPrescription(@PathVariable Long id) {

    return ResponseEntity.ok(prescriptionService.getPrescription(id));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','DOCTOR') or @authorizationService.isCurrentPatient(#patientId)"
  )
  @GetMapping("/patient/{patientId}")
  public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(
      @PathVariable Long patientId
  ) {

    return ResponseEntity.ok(prescriptionService.getPatientPrescriptions(patientId));
  }

  @PreAuthorize(
      "hasRole('ADMIN') " +
          "or @authorizationService.canAccessConsultation(#consultationId)"
  )
  @GetMapping("/consultation/{consultationId}")
  public List<PrescriptionResponse> getByConsultation(
      @PathVariable Long consultationId
  ) {

    return prescriptionService.getPrescriptionsByConsultation(consultationId);
  }
}