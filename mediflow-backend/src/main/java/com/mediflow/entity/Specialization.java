package com.mediflow.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "specializations")
public class Specialization {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long specializationId;

  @Column(nullable = false, unique = true)
  private String name;

  private String description;

  //@OneToMany(mappedBy = "specialization")
  private List<Doctor> doctors = new ArrayList<>();

  public Specialization() {
  }

  public Long getSpecializationId() {
    return specializationId;
  }

  public void setSpecializationId(Long specializationId) {
    this.specializationId = specializationId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<Doctor> getDoctors() {
    return doctors;
  }

  public void setDoctors(List<Doctor> doctors) {
    this.doctors = doctors;
  }
}