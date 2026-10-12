package com.mediflow.service;

import com.mediflow.dto.doctor.CreateDoctorRequest;
import com.mediflow.dto.doctor.DoctorResponse;
import com.mediflow.dto.doctor.UpdateDoctorRequest;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Specialization;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.DoctorMapper;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.SpecializationRepository;
import com.mediflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DoctorService {

  private final DoctorRepository doctorRepository;
  private final SpecializationRepository specializationRepository;
  private final UserRepository userRepository;

  public DoctorService(
      DoctorRepository doctorRepository,
      SpecializationRepository specializationRepository,
      UserRepository userRepository
  ) {

    this.doctorRepository = doctorRepository;
    this.specializationRepository = specializationRepository;
    this.userRepository = userRepository;
  }

  public DoctorResponse createDoctor(CreateDoctorRequest request) {

    if (userRepository.existsByUsername(request.username())) {
      throw new IllegalArgumentException(
          "Username already exists"
      );
    }

    if (userRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException(
          "Email already exists"
      );
    }

    Specialization specialization = specializationRepository
        .findById(request.specializationId())
        .orElseThrow(() ->
            new ResourceNotFoundException(
                    "Specialization not found with id: " + request.specializationId()
            )
        );

    Doctor doctor = new Doctor();

    doctor.setUsername(request.username());
    doctor.setPasswordHash(request.password()); // temporary
    doctor.setEmail(request.email());
    doctor.setPhoneNumber(request.phoneNumber());
    doctor.setFirstName(request.firstName());
    doctor.setLastName(request.lastName());
    doctor.setLicenseNumber(request.licenseNumber());
    doctor.setBio(request.bio());
    doctor.setSpecialization(specialization);

    return DoctorMapper.toResponse(doctorRepository.save(doctor));
  }

  @Transactional(readOnly = true)
  public DoctorResponse getDoctor(Long id) {

    return DoctorMapper.toResponse(findDoctor(id));
  }

  @Transactional(readOnly = true)
  public List<DoctorResponse> getAllDoctors() {

    return doctorRepository
        .findAll()
        .stream()
        .map(DoctorMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<DoctorResponse> findBySpecialization(String specialization) {

    return doctorRepository
        .findBySpecializationNameIgnoreCase(specialization)
        .stream()
        .map(DoctorMapper::toResponse)
        .toList();
  }

  public DoctorResponse updateDoctor(Long id, UpdateDoctorRequest request) {

    Doctor doctor = findDoctor(id);

    if (request.firstName() != null) {
      doctor.setFirstName(request.firstName());
    }

    if (request.lastName() != null) {
      doctor.setLastName(request.lastName());
    }

    if (request.email() != null) {
      doctor.setEmail(request.email());
    }

    if (request.phoneNumber() != null) {
      doctor.setPhoneNumber(request.phoneNumber());
    }

    if (request.licenseNumber() != null) {
      doctor.setLicenseNumber(request.licenseNumber());
    }

    if (request.bio() != null) {
      doctor.setBio(request.bio());
    }

    if (request.specializationId() != null) {

      Specialization specialization =
          specializationRepository
              .findById(request.specializationId())
              .orElseThrow(() ->
                  new ResourceNotFoundException("Specialization not found")
              );

      doctor.setSpecialization(specialization);
    }

    return DoctorMapper.toResponse(doctorRepository.save(doctor));
  }

  private Doctor findDoctor(Long id) {

    return doctorRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException("Doctor not found with id: " + id)
        );
  }
}