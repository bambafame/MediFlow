package com.mediflow.controller;

import com.mediflow.dto.doctor.AvailabilityResponse;
import com.mediflow.dto.doctor.CreateAvailabilityRequest;
import com.mediflow.entity.Availability;
import com.mediflow.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/doctors/{doctorId}/availability")
public class AvailabilityController {

  private final AvailabilityService availabilityService;

  public AvailabilityController(AvailabilityService availabilityService) {

    this.availabilityService = availabilityService;
  }

  @PreAuthorize(
      "hasAnyRole('ADMIN','RECEPTIONIST') or @authorizationService.isCurrentDoctor(#doctorId)"
  )
  @PostMapping
  public ResponseEntity<AvailabilityResponse> createAvailability(
      @PathVariable Long doctorId,
      @Valid @RequestBody CreateAvailabilityRequest request
  ) {

    Availability saved = availabilityService.createAvailability(doctorId, request);

    return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping
  public ResponseEntity<List<AvailabilityResponse>> getDoctorAvailability(
      @PathVariable Long doctorId,
      @RequestParam(required = false) DayOfWeek day
  ) {

    List<Availability> result;

    if (day == null) {
      result = availabilityService.getDoctorAvailability(doctorId);
    } else {
      result = availabilityService.getDoctorAvailability(doctorId, day);
    }

    return ResponseEntity.ok(result.stream().map(this::toResponse).toList());
  }

  private AvailabilityResponse toResponse(Availability availability) {

    return new AvailabilityResponse(
        availability.getAvailabilityId(),
        availability.getDoctor().getUserId(),
        availability.getDayOfWeek(),
        availability.getStartTime(),
        availability.getEndTime(),
        availability.isAvailable()
    );
  }
}