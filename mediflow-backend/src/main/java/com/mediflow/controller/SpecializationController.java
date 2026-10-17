package com.mediflow.controller;

import com.mediflow.dto.specialization.CreateSpecializationRequest;
import com.mediflow.dto.specialization.SpecializationResponse;
import com.mediflow.service.SpecializationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specializations")
public class SpecializationController {

  private final SpecializationService specializationService;

  public SpecializationController(SpecializationService specializationService) {

    this.specializationService = specializationService;
  }

  @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
  @PostMapping
  public ResponseEntity<SpecializationResponse>
  create(@Valid @RequestBody CreateSpecializationRequest request) {

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(specializationService.create(request));
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping
  public ResponseEntity<List<SpecializationResponse>> getAll() {

    return ResponseEntity.ok(specializationService.getAll());
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/{id}")
  public ResponseEntity<SpecializationResponse> getById(@PathVariable Long id) {

    return ResponseEntity.ok(specializationService.getById(id));
  }
}