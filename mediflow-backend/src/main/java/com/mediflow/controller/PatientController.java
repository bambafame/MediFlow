package com.mediflow.controller;

import com.mediflow.dto.patient.CreatePatientRequest;
import com.mediflow.dto.patient.PatientResponse;
import com.mediflow.dto.patient.UpdatePatientRequest;
import com.mediflow.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

  private final PatientService patientService;

  public PatientController(PatientService patientService) {

    this.patientService = patientService;
  }

  @PostMapping
  public ResponseEntity<PatientResponse> createPatient(
      @Valid @RequestBody CreatePatientRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(patientService.createPatient(request));
  }

  @GetMapping("/{id}")
  public ResponseEntity<PatientResponse> getPatient(@PathVariable Long id) {

    return ResponseEntity.ok(patientService.getPatient(id));
  }

  @GetMapping
  public ResponseEntity<List<PatientResponse>> getAllPatients() {

    return ResponseEntity.ok(patientService.getAllPatients());
  }

  @PutMapping("/{id}")
  public ResponseEntity<PatientResponse> updatePatient(
      @PathVariable Long id,
      @Valid @RequestBody UpdatePatientRequest request
  ) {

    return ResponseEntity.ok(patientService.updatePatient(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePatient(@PathVariable Long id) {

    patientService.deletePatient(id);

    return ResponseEntity.noContent().build();
  }
}