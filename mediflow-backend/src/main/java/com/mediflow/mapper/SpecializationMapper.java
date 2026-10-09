package com.mediflow.mapper;

import com.mediflow.dto.specialization.SpecializationResponse;
import com.mediflow.entity.Specialization;

public final class SpecializationMapper {

  private SpecializationMapper() {
  }

  public static SpecializationResponse toResponse(Specialization specialization) {

    return new SpecializationResponse(
        specialization.getSpecializationId(),
        specialization.getName(),
        specialization.getDescription()
    );
  }
}