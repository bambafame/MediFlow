package com.mediflow.service;

import com.mediflow.entity.Doctor;
import com.mediflow.entity.Specialization;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.DoctorRepository;
import com.mediflow.repository.SpecializationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DoctorService {

  private final DoctorRepository doctorRepository;
  private final SpecializationRepository specializationRepository;

  public DoctorService(
      DoctorRepository doctorRepository,
      SpecializationRepository specializationRepository) {

    this.doctorRepository = doctorRepository;
    this.specializationRepository = specializationRepository;
  }

  public Doctor createDoctor(Doctor doctor, Long specializationId) {

    Specialization specialization =
        specializationRepository.findById(specializationId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Specialization not found with id: "
                        + specializationId
                ));

    doctor.setSpecialization(specialization);

    return doctorRepository.save(doctor);
  }

  @Transactional(readOnly = true)
  public Doctor getDoctor(Long id) {
    return doctorRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "Doctor not found with id: " + id
            ));
  }

  @Transactional(readOnly = true)
  public List<Doctor> getAllDoctors() {
    return doctorRepository.findAll();
  }

  @Transactional(readOnly = true)
  public List<Doctor> findBySpecialization(String specialization) {
    return doctorRepository
        .findBySpecializationNameIgnoreCase(specialization);
  }

  public Doctor updateDoctor(Long id, Doctor updatedDoctor) {

    Doctor doctor = getDoctor(id);

    doctor.setFirstName(updatedDoctor.getFirstName());
    doctor.setLastName(updatedDoctor.getLastName());
    doctor.setLicenseNumber(updatedDoctor.getLicenseNumber());
    doctor.setBio(updatedDoctor.getBio());

    doctor.setEmail(updatedDoctor.getEmail());
    doctor.setPhoneNumber(updatedDoctor.getPhoneNumber());

    return doctorRepository.save(doctor);
  }
}