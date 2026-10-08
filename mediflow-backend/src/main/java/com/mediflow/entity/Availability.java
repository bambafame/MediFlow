package com.mediflow.entity;

import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "availabilities")
public class Availability {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long availabilityId;

  @ManyToOne(optional = false)
  @JoinColumn(name = "doctor_id", nullable = false)
  private Doctor doctor;

  @Enumerated(EnumType.STRING)
  private DayOfWeek dayOfWeek;

  private LocalTime startTime;

  private LocalTime endTime;

  private boolean available = true;

  public Availability() {
  }

  public Long getAvailabilityId() {
    return availabilityId;
  }

  public void setAvailabilityId(Long availabilityId) {
    this.availabilityId = availabilityId;
  }

  public Doctor getDoctor() {
    return doctor;
  }

  public void setDoctor(Doctor doctor) {
    this.doctor = doctor;
  }

  public DayOfWeek getDayOfWeek() {
    return dayOfWeek;
  }

  public void setDayOfWeek(DayOfWeek dayOfWeek) {
    this.dayOfWeek = dayOfWeek;
  }

  public LocalTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalTime startTime) {
    this.startTime = startTime;
  }

  public LocalTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalTime endTime) {
    this.endTime = endTime;
  }

  public boolean isAvailable() {
    return available;
  }

  public void setAvailable(boolean available) {
    this.available = available;
  }
}