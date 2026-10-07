package com.mediflow.repository;

import com.mediflow.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

  Optional<Consultation> findByAppointmentAppointmentId(
      Long appointmentId
  );
}