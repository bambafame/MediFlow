package com.mediflow.service;

import com.mediflow.dto.prescription.CreatePrescriptionRequest;
import com.mediflow.dto.prescription.PrescriptionResponse;
import com.mediflow.entity.Consultation;
import com.mediflow.entity.Prescription;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.mapper.PrescriptionMapper;
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
      ConsultationRepository consultationRepository
  ) {

    this.prescriptionRepository = prescriptionRepository;

    this.consultationRepository = consultationRepository;
  }

  public PrescriptionResponse createPrescription(CreatePrescriptionRequest request) {

    Consultation consultation = consultationRepository
            .findById(request.consultationId())
            .orElseThrow(() -> new ResourceNotFoundException("Consultation not found"));

    Prescription prescription = new Prescription();

    prescription.setConsultation(consultation);

    prescription.setMedicationName(request.medicationName());

    prescription.setDosage(request.dosage());

    prescription.setInstructions(request.instructions());

    Prescription saved = prescriptionRepository.save(prescription);

    return PrescriptionMapper.toResponse(saved);
  }

  @Transactional(readOnly = true)
  public PrescriptionResponse getPrescription(Long id) {

    Prescription prescription = prescriptionRepository
        .findById(id)
        .orElseThrow(() ->
            new ResourceNotFoundException("Prescription not found with id: " + id)
        );
    return PrescriptionMapper.toResponse(prescription);
  }

  @Transactional(readOnly = true)
  public List<PrescriptionResponse>
  getPatientPrescriptions(Long patientId) {

    return prescriptionRepository
        .findByConsultationAppointmentPatientUserId(patientId)
        .stream()
        .map(PrescriptionMapper::toResponse)
        .toList();
  }

  public List<PrescriptionResponse> getPrescriptionsByConsultation(Long consultationId) {

    return prescriptionRepository
        .findByConsultationConsultationId(consultationId)
        .stream()
        .map(PrescriptionMapper::toResponse)
        .toList();
  }
}