package com.mediflow.service;

import com.mediflow.dto.doctor.CreateAvailabilityRequest;
import com.mediflow.entity.Availability;
import com.mediflow.entity.Doctor;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.AvailabilityRepository;
import com.mediflow.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;

@Service
@Transactional
public class AvailabilityService {

  private final AvailabilityRepository availabilityRepository;
  private final DoctorRepository doctorRepository;

  public AvailabilityService(
      AvailabilityRepository availabilityRepository,
      DoctorRepository doctorRepository
  ) {

    this.availabilityRepository = availabilityRepository;

    this.doctorRepository = doctorRepository;
  }

  public Availability createAvailability(
      Long doctorId, CreateAvailabilityRequest request
  ) {

    Doctor doctor =
        doctorRepository.findById(doctorId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Doctor not found with id: " + doctorId)
            );

    if (!request.startTime().isBefore(request.endTime())) {
      throw new IllegalArgumentException("Availability start time must be before end time");
    }

    Availability availability = new Availability();

    availability.setDoctor(doctor);
    availability.setDayOfWeek(request.dayOfWeek());

    availability.setStartTime(request.startTime());

    availability.setEndTime(request.endTime());

    availability.setAvailable(true);

    return availabilityRepository.save(availability);
  }

  @Transactional(readOnly = true)
  public List<Availability> getDoctorAvailability(Long doctorId) {

    return availabilityRepository.findByDoctorUserId(doctorId);
  }

  @Transactional(readOnly = true)
  public List<Availability> getDoctorAvailability(Long doctorId, DayOfWeek day) {

    return availabilityRepository.findByDoctorUserIdAndDayOfWeek(doctorId, day);
  }
}