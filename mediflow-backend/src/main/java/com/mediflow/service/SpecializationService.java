package com.mediflow.service;

import com.mediflow.entity.Specialization;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.SpecializationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SpecializationService {

  private final SpecializationRepository specializationRepository;

  public SpecializationService(SpecializationRepository specializationRepository) {
    this.specializationRepository = specializationRepository;
  }

  public Specialization create(Specialization specialization) {
    return specializationRepository.save(specialization);
  }

  @Transactional(readOnly = true)
  public Specialization getById(Long id) {
    return specializationRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "Specialization not found with id: " + id
            ));
  }

  @Transactional(readOnly = true)
  public List<Specialization> getAll() {
    return specializationRepository.findAll();
  }
}