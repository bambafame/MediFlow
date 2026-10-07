package com.mediflow.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "consultations")
public class Consultation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long consultationId;

  /*@OneToOne(optional = false)
  @JoinColumn(
      name = "appointment_id",
      nullable = false,
      unique = true
  )*/
  private Appointment appointment;

  @Column(length = 3000)
  private String notes;

  private String diagnosis;

  private LocalDateTime createdAt;

  /*@OneToMany(
      mappedBy = "consultation",
      cascade = CascadeType.ALL
  )*/
  private List<Prescription> prescriptions = new ArrayList<>();

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  public Consultation() {
  }

  public Long getConsultationId() {
    return consultationId;
  }

  public void setConsultationId(Long consultationId) {
    this.consultationId = consultationId;
  }

  public Appointment getAppointment() {
    return appointment;
  }

  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public String getDiagnosis() {
    return diagnosis;
  }

  public void setDiagnosis(String diagnosis) {
    this.diagnosis = diagnosis;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}