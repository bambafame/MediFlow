package com.mediflow.repository;

import com.mediflow.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

  List<Availability> findByDoctorUserId(Long doctorId);

  List<Availability> findByDoctorUserIdAndDayOfWeek(
      Long doctorId,
      DayOfWeek dayOfWeek
  );
}