package com.mediflow.service;

import com.mediflow.dto.patient.CreatePatientRequest;
import com.mediflow.dto.patient.PatientResponse;
import com.mediflow.dto.patient.UpdatePatientRequest;
import com.mediflow.entity.Patient;
import com.mediflow.entity.Role;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.PatientMapper;
import com.mediflow.repository.PatientRepository;
import com.mediflow.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PatientService {

  private final PatientRepository patientRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public PatientService(
      PatientRepository patientRepository,
      UserRepository userRepository,
      PasswordEncoder passwordEncoder
  ) {

    this.patientRepository = patientRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public PatientResponse createPatient(CreatePatientRequest request) {

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

    Patient patient = new Patient();

    patient.setRole(Role.PATIENT);
    patient.setUsername(request.username());
    patient.setPasswordHash(passwordEncoder.encode(request.password()));
    patient.setEmail(request.email());
    patient.setPhoneNumber(request.phoneNumber());
    patient.setFirstName(request.firstName());
    patient.setLastName(request.lastName());
    patient.setDateOfBirth(request.dateOfBirth());
    patient.setMailingAddress(request.mailingAddress());

    Patient saved = patientRepository.save(patient);

    return PatientMapper.toResponse(saved);
  }

  @Transactional(readOnly = true)
  public PatientResponse getPatient(Long id) {

    Patient patient = findPatient(id);

    return PatientMapper.toResponse(patient);
  }

  @Transactional(readOnly = true)
  public List<PatientResponse> getAllPatients() {

    return patientRepository
        .findAll()
        .stream()
        .map(PatientMapper::toResponse)
        .toList();
  }

  public PatientResponse updatePatient(Long id, UpdatePatientRequest request) {

    Patient patient = findPatient(id);

    if (request.firstName() != null) {
      patient.setFirstName(request.firstName());
    }

    if (request.lastName() != null) {
      patient.setLastName(request.lastName());
    }

    if (request.email() != null) {
      patient.setEmail(request.email());
    }

    if (request.phoneNumber() != null) {
      patient.setPhoneNumber(request.phoneNumber());
    }

    if (request.dateOfBirth() != null) {
      patient.setDateOfBirth(request.dateOfBirth());
    }

    if (request.mailingAddress() != null) {
      patient.setMailingAddress(request.mailingAddress());
    }

    Patient saved = patientRepository.save(patient);

    return PatientMapper.toResponse(saved);
  }

  public void deletePatient(Long id) {

    Patient patient = findPatient(id);

    patientRepository.delete(patient);
  }

  private Patient findPatient(Long id) {

    return patientRepository.findById(id)
        .orElseThrow(
            () -> new ResourceNotFoundException("Patient not found with id: " + id)
        );
  }
}