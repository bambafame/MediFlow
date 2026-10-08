package com.mediflow.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctors")
@PrimaryKeyJoinColumn(name = "user_id")
public class Doctor extends User {

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String licenseNumber;

  private String bio;

  @ManyToOne
  @JoinColumn(name = "specialization_id")
  private Specialization specialization;

  @OneToMany(
      mappedBy = "doctor",
      cascade = CascadeType.ALL
  )
  private List<Appointment> appointments = new ArrayList<>();

  @OneToMany(
      mappedBy = "doctor",
      cascade = CascadeType.ALL
  )
  private List<Availability> availabilities = new ArrayList<>();

  public Doctor() {
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getLicenseNumber() {
    return licenseNumber;
  }

  public void setLicenseNumber(String licenseNumber) {
    this.licenseNumber = licenseNumber;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public Specialization getSpecialization() {
    return specialization;
  }

  public void setSpecialization(Specialization specialization) {
    this.specialization = specialization;
  }

  public List<Appointment> getAppointments() {
    return appointments;
  }

  public void setAppointments(List<Appointment> appointments) {
    this.appointments = appointments;
  }

  public List<Availability> getAvailabilities() {
    return availabilities;
  }

  public void setAvailabilities(List<Availability> availabilities) {
    this.availabilities = availabilities;
  }
}