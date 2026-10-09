package com.mediflow.service;

import com.mediflow.entity.Patient;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PatientService {

  private final PatientRepository patientRepository;

  public PatientService(PatientRepository patientRepository) {
    this.patientRepository = patientRepository;
  }

  public Patient createPatient(Patient patient) {
    return patientRepository.save(patient);
  }

  @Transactional(readOnly = true)
  public Patient getPatient(Long id) {
    return patientRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "Patient not found with id: " + id
            ));
  }

  @Transactional(readOnly = true)
  public List<Patient> getAllPatients() {
    return patientRepository.findAll();
  }

  public Patient updatePatient(Long id, Patient updatedPatient) {

    Patient patient = getPatient(id);

    patient.setFirstName(updatedPatient.getFirstName());
    patient.setLastName(updatedPatient.getLastName());
    patient.setDateOfBirth(updatedPatient.getDateOfBirth());
    patient.setMailingAddress(updatedPatient.getMailingAddress());

    patient.setEmail(updatedPatient.getEmail());
    patient.setPhoneNumber(updatedPatient.getPhoneNumber());

    return patientRepository.save(patient);
  }

  public void deletePatient(Long id) {
    Patient patient = getPatient(id);
    patientRepository.delete(patient);
  }
}