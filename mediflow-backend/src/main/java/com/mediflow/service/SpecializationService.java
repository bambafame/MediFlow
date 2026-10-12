package com.mediflow.service;

import com.mediflow.dto.specialization.CreateSpecializationRequest;
import com.mediflow.dto.specialization.SpecializationResponse;
import com.mediflow.entity.Specialization;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.SpecializationMapper;
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

  public SpecializationResponse create(CreateSpecializationRequest request) {

    specializationRepository.findByNameIgnoreCase(request.name())
        .ifPresent(existing -> {
          throw new IllegalArgumentException("Specialization already exists");
        });

    Specialization specialization = new Specialization();

    specialization.setName(request.name());

    specialization.setDescription(request.description());

    return SpecializationMapper.toResponse(specializationRepository.save(specialization)
    );
  }

  @Transactional(readOnly = true)
  public SpecializationResponse getById(Long id) {

    Specialization specialization = specializationRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException("Specialization not found with id: " + id)
        );
    return SpecializationMapper.toResponse(specialization);
  }

  @Transactional(readOnly = true)
  public List<SpecializationResponse> getAll() {

    return specializationRepository.findAll()
        .stream()
        .map(SpecializationMapper::toResponse)
        .toList();
  }
}