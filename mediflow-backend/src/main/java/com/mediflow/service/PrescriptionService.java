package com.mediflow.service;

import com.mediflow.entity.Consultation;
import com.mediflow.entity.Prescription;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.ConsultationRepository;
import com.mediflow.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PrescriptionService {

  private final PrescriptionRepository prescriptionRepository;
  private final ConsultationRepository consultationRepository;

  public PrescriptionService(
      PrescriptionRepository prescriptionRepository,
      ConsultationRepository consultationRepository)
  {
    this.prescriptionRepository = prescriptionRepository;
    this.consultationRepository = consultationRepository;
  }

  public Prescription createPrescription(Long consultationId, Prescription prescription) {

    Consultation consultation = consultationRepository.findById(consultationId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Consultation not found with id: " + consultationId
                ));

    prescription.setConsultation(consultation);

    return prescriptionRepository.save(prescription);
  }

  @Transactional(readOnly = true)
  public Prescription getPrescription(Long id) {

    return prescriptionRepository.findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "Prescription not found with id: " + id
            ));
  }

  @Transactional(readOnly = true)
  public List<Prescription> getPatientPrescriptions(Long patientId) {

    return prescriptionRepository
        .findByConsultationAppointmentPatientUserId(patientId);
  }
}