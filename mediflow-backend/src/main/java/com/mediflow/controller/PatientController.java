package com.mediflow.controller;

import com.mediflow.dto.patient.CreatePatientRequest;
import com.mediflow.dto.patient.PatientResponse;
import com.mediflow.dto.patient.UpdatePatientRequest;
import com.mediflow.dto.prescription.PrescriptionResponse;
import com.mediflow.service.PatientService;
import com.mediflow.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

  private final PatientService patientService;
  private final PrescriptionService prescriptionService;

  public PatientController(
      PatientService patientService, PrescriptionService prescriptionService
  ) {

    this.patientService = patientService;
    this.prescriptionService = prescriptionService;
  }

  @PostMapping
  public ResponseEntity<PatientResponse> createPatient(
      @Valid @RequestBody CreatePatientRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(patientService.createPatient(request));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR') or @authorizationService.isCurrentUser(#id)"
  )
  @GetMapping("/{id}")
  public ResponseEntity<PatientResponse> getPatient(@PathVariable Long id) {

    return ResponseEntity.ok(patientService.getPatient(id));
  }

  @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
  @GetMapping
  public ResponseEntity<List<PatientResponse>> getAllPatients() {

    return ResponseEntity.ok(patientService.getAllPatients());
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isCurrentUser(#id)"
  )
  @PutMapping("/{id}")
  public ResponseEntity<PatientResponse> updatePatient(
      @PathVariable Long id,
      @Valid @RequestBody UpdatePatientRequest request
  ) {

    return ResponseEntity.ok(patientService.updatePatient(id, request));
  }

  @PreAuthorize(
     "hasAnyRole('ADMIN', 'DOCTOR') or @authorizationService.isCurrentUser(#patientId)"
  )
  @GetMapping("/patient/{patientId}")
  public List<PrescriptionResponse>
  getPatientPrescriptions(@PathVariable Long patientId) {
    return prescriptionService.getPatientPrescriptions(patientId);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePatient(@PathVariable Long id) {

    patientService.deletePatient(id);

    return ResponseEntity.noContent().build();
  }
}