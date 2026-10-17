package com.mediflow.controller;

import com.mediflow.dto.doctor.CreateDoctorRequest;
import com.mediflow.dto.doctor.DoctorResponse;
import com.mediflow.dto.doctor.UpdateDoctorRequest;
import com.mediflow.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

  private final DoctorService doctorService;

  public DoctorController(DoctorService doctorService) {

    this.doctorService = doctorService;
  }

  @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
  @PostMapping
  public ResponseEntity<DoctorResponse> createDoctor(
      @Valid @RequestBody CreateDoctorRequest request
  ) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(doctorService.createDoctor(request));
  }

  @PreAuthorize( "hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR','PATIENT')")
  @GetMapping("/{id}")
  public ResponseEntity<DoctorResponse> getDoctor(@PathVariable Long id) {

    return ResponseEntity.ok(doctorService.getDoctor(id));
  }

  @PreAuthorize( "hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR','PATIENT')")
  @GetMapping
  public ResponseEntity<List<DoctorResponse>> getAllDoctors() {

    return ResponseEntity.ok(doctorService.getAllDoctors());
  }

  @GetMapping("/search")
  public ResponseEntity<List<DoctorResponse>> searchBySpecialization(@RequestParam String specialization) {

    return ResponseEntity.ok(doctorService.findBySpecialization(specialization));
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isCurrentUser(#id)"
  )
  @PutMapping("/{id}")
  public ResponseEntity<DoctorResponse> updateDoctor(
      @PathVariable Long id,
      @Valid @RequestBody UpdateDoctorRequest request
  ) {

    return ResponseEntity.ok(doctorService.updateDoctor(id, request));
  }

  
}