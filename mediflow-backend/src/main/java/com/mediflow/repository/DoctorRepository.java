package com.mediflow.repository;

import com.mediflow.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

  List<Doctor> findBySpecializationNameIgnoreCase(String specializationName);
}