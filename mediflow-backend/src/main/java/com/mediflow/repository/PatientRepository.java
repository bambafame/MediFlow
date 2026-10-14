package com.mediflow.repository;

import com.mediflow.entity.Patient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
  List<Patient> findTop5ByOrderByCreatedAtDesc();
}