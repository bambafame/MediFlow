package com.mediflow.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
public class Prescription {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long prescriptionId;

  /*@ManyToOne(optional = false)
  @JoinColumn(name = "consultation_id")*/
  private Consultation consultation;

  @Column(nullable = false)
  private String medicationName;

  private String dosage;

  private String instructions;

  private LocalDate prescribedDate;

  public Prescription() {
  }

  @PrePersist
  protected void onCreate() {
    if (prescribedDate == null) {
      prescribedDate = LocalDate.now();
    }
  }

  public Long getPrescriptionId() {
    return prescriptionId;
  }

  public void setPrescriptionId(Long prescriptionId) {
    this.prescriptionId = prescriptionId;
  }

  public Consultation getConsultation() {
    return consultation;
  }

  public void setConsultation(Consultation consultation) {
    this.consultation = consultation;
  }

  public String getMedicationName() {
    return medicationName;
  }

  public void setMedicationName(String medicationName) {
    this.medicationName = medicationName;
  }

  public String getDosage() {
    return dosage;
  }

  public void setDosage(String dosage) {
    this.dosage = dosage;
  }

  public String getInstructions() {
    return instructions;
  }

  public void setInstructions(String instructions) {
    this.instructions = instructions;
  }

  public LocalDate getPrescribedDate() {
    return prescribedDate;
  }

  public void setPrescribedDate(LocalDate prescribedDate) {
    this.prescribedDate = prescribedDate;
  }
}