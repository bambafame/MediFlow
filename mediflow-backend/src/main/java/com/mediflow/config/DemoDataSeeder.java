package com.mediflow.config;

import com.mediflow.entity.Appointment;
import com.mediflow.entity.AppointmentStatus;
import com.mediflow.entity.Availability;
import com.mediflow.entity.Consultation;
import com.mediflow.entity.Doctor;
import com.mediflow.entity.Patient;
import com.mediflow.entity.Prescription;
import com.mediflow.entity.Role;
import com.mediflow.entity.Specialization;
import com.mediflow.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
@ConditionalOnProperty(
    name = "app.demo-data.enabled",
    havingValue = "true"
)
public class DemoDataSeeder {

  @Bean
  @Order(2)
  CommandLineRunner seedDemoData(
      UserRepository userRepository,
      PatientRepository patientRepository,
      DoctorRepository doctorRepository,
      SpecializationRepository specializationRepository,
      AvailabilityRepository availabilityRepository,
      AppointmentRepository appointmentRepository,
      ConsultationRepository consultationRepository,
      PrescriptionRepository prescriptionRepository,
      PasswordEncoder passwordEncoder
  ) {
    return args -> {

      System.out.println("=== MediFlow demo data seeder enabled ===");

      /*
       * This marker prevents duplicate demo records every time
       * the Docker container restarts.
       */
      if (userRepository.existsByUsername("dr.mitchell")) {
        System.out.println("Demo data already exists. Skipping.");
        return;
      }

      /*
       * ---------------------------------------------------------
       * SPECIALIZATIONS
       * ---------------------------------------------------------
       */

      Specialization cardiology = new Specialization();
      cardiology.setName("Cardiology");
      cardiology.setDescription(
          "Diagnosis and treatment of cardiovascular conditions."
      );
      cardiology = specializationRepository.save(cardiology);

      Specialization generalMedicine = new Specialization();
      generalMedicine.setName("General Medicine");
      generalMedicine.setDescription(
          "Primary care, preventive medicine and general health management."
      );
      generalMedicine = specializationRepository.save(generalMedicine);

      Specialization dermatology = new Specialization();
      dermatology.setName("Dermatology");
      dermatology.setDescription(
          "Diagnosis and treatment of skin, hair and nail disorders."
      );
      dermatology = specializationRepository.save(dermatology);

      Specialization pediatrics = new Specialization();
      pediatrics.setName("Pediatrics");
      pediatrics.setDescription(
          "Medical care for infants, children and adolescents."
      );
      specializationRepository.save(pediatrics);


      /*
       * ---------------------------------------------------------
       * DOCTORS
       * ---------------------------------------------------------
       */

      Doctor drMitchell = new Doctor();

      drMitchell.setUsername("dr.mitchell");
      drMitchell.setPasswordHash(
          passwordEncoder.encode("Doctor@123")
      );
      drMitchell.setEmail("sarah.mitchell@mediflow-demo.com");
      drMitchell.setPhoneNumber("555-0201");
      drMitchell.setEnabled(true);
      drMitchell.setRole(Role.DOCTOR);

      drMitchell.setFirstName("Sarah");
      drMitchell.setLastName("Mitchell");
      drMitchell.setLicenseNumber("IA-MD-1001");
      drMitchell.setBio(
          "Cardiologist specializing in preventive cardiovascular care."
      );
      drMitchell.setSpecialization(cardiology);

      drMitchell = doctorRepository.save(drMitchell);


      Doctor drKim = new Doctor();

      drKim.setUsername("dr.kim");
      drKim.setPasswordHash(
          passwordEncoder.encode("Doctor@123")
      );
      drKim.setEmail("daniel.kim@mediflow-demo.com");
      drKim.setPhoneNumber("555-0202");
      drKim.setEnabled(true);
      drKim.setRole(Role.DOCTOR);

      drKim.setFirstName("Daniel");
      drKim.setLastName("Kim");
      drKim.setLicenseNumber("IA-MD-1002");
      drKim.setBio(
          "Primary-care physician focused on preventive and chronic-disease management."
      );
      drKim.setSpecialization(generalMedicine);

      drKim = doctorRepository.save(drKim);


      Doctor drCarter = new Doctor();

      drCarter.setUsername("dr.carter");
      drCarter.setPasswordHash(
          passwordEncoder.encode("Doctor@123")
      );
      drCarter.setEmail("emily.carter@mediflow-demo.com");
      drCarter.setPhoneNumber("555-0203");
      drCarter.setEnabled(true);
      drCarter.setRole(Role.DOCTOR);

      drCarter.setFirstName("Emily");
      drCarter.setLastName("Carter");
      drCarter.setLicenseNumber("IA-MD-1003");
      drCarter.setBio(
          "Dermatologist specializing in inflammatory and chronic skin conditions."
      );
      drCarter.setSpecialization(dermatology);

      drCarter = doctorRepository.save(drCarter);


      /*
       * ---------------------------------------------------------
       * PATIENTS
       * ---------------------------------------------------------
       */

      Patient james = createPatient(
          "james.anderson",
          "James",
          "Anderson",
          "james.anderson@example.com",
          "555-0101",
          LocalDate.of(1987, 4, 12),
          "145 Oak Street, Cedar Falls, IA",
          passwordEncoder
      );

      james = patientRepository.save(james);


      Patient maria = createPatient(
          "maria.lopez",
          "Maria",
          "Lopez",
          "maria.lopez@example.com",
          "555-0102",
          LocalDate.of(1993, 9, 21),
          "82 Maple Avenue, Des Moines, IA",
          passwordEncoder
      );

      maria = patientRepository.save(maria);


      Patient robert = createPatient(
          "robert.williams",
          "Robert",
          "Williams",
          "robert.williams@example.com",
          "555-0103",
          LocalDate.of(1971, 11, 5),
          "310 Pine Road, Ames, IA",
          passwordEncoder
      );

      robert = patientRepository.save(robert);


      Patient sophia = createPatient(
          "sophia.johnson",
          "Sophia",
          "Johnson",
          "sophia.johnson@example.com",
          "555-0104",
          LocalDate.of(2000, 6, 18),
          "44 River Drive, Iowa City, IA",
          passwordEncoder
      );

      sophia = patientRepository.save(sophia);


      /*
       * ---------------------------------------------------------
       * AVAILABILITY
       * ---------------------------------------------------------
       */

      saveAvailability(
          availabilityRepository,
          drMitchell,
          DayOfWeek.MONDAY,
          LocalTime.of(9, 0),
          LocalTime.of(12, 0)
      );

      saveAvailability(
          availabilityRepository,
          drMitchell,
          DayOfWeek.WEDNESDAY,
          LocalTime.of(13, 0),
          LocalTime.of(17, 0)
      );

      saveAvailability(
          availabilityRepository,
          drMitchell,
          DayOfWeek.FRIDAY,
          LocalTime.of(9, 0),
          LocalTime.of(12, 0)
      );


      saveAvailability(
          availabilityRepository,
          drKim,
          DayOfWeek.MONDAY,
          LocalTime.of(8, 0),
          LocalTime.of(16, 0)
      );

      saveAvailability(
          availabilityRepository,
          drKim,
          DayOfWeek.TUESDAY,
          LocalTime.of(8, 0),
          LocalTime.of(16, 0)
      );

      saveAvailability(
          availabilityRepository,
          drKim,
          DayOfWeek.THURSDAY,
          LocalTime.of(8, 0),
          LocalTime.of(16, 0)
      );


      saveAvailability(
          availabilityRepository,
          drCarter,
          DayOfWeek.TUESDAY,
          LocalTime.of(10, 0),
          LocalTime.of(15, 0)
      );

      saveAvailability(
          availabilityRepository,
          drCarter,
          DayOfWeek.WEDNESDAY,
          LocalTime.of(10, 0),
          LocalTime.of(15, 0)
      );

      saveAvailability(
          availabilityRepository,
          drCarter,
          DayOfWeek.FRIDAY,
          LocalTime.of(10, 0),
          LocalTime.of(15, 0)
      );


      /*
       * ---------------------------------------------------------
       * APPOINTMENTS
       *
       * Dates are relative to startup, so the demo remains useful
       * even if you redeploy it later.
       * ---------------------------------------------------------
       */

      LocalDate today = LocalDate.now();

      Appointment completed = new Appointment();
      completed.setPatient(robert);
      completed.setDoctor(drKim);
      completed.setStartDateTime(
          today.minusDays(1).atTime(14, 0)
      );
      completed.setEndDateTime(
          today.minusDays(1).atTime(14, 30)
      );
      completed.setReason("Annual health examination");
      completed.setStatus(AppointmentStatus.COMPLETED);

      completed = appointmentRepository.save(completed);


      Appointment mariaAppointment = new Appointment();
      mariaAppointment.setPatient(maria);
      mariaAppointment.setDoctor(drCarter);
      mariaAppointment.setStartDateTime(
          today.plusDays(1).atTime(11, 0)
      );
      mariaAppointment.setEndDateTime(
          today.plusDays(1).atTime(11, 30)
      );
      mariaAppointment.setReason("Persistent skin rash");
      mariaAppointment.setStatus(AppointmentStatus.SCHEDULED);

      appointmentRepository.save(mariaAppointment);


      Appointment jamesAppointment = new Appointment();
      jamesAppointment.setPatient(james);
      jamesAppointment.setDoctor(drMitchell);
      jamesAppointment.setStartDateTime(
          today.plusDays(2).atTime(9, 30)
      );
      jamesAppointment.setEndDateTime(
          today.plusDays(2).atTime(10, 0)
      );
      jamesAppointment.setReason(
          "Intermittent chest discomfort during exercise"
      );
      jamesAppointment.setStatus(AppointmentStatus.CONFIRMED);

      appointmentRepository.save(jamesAppointment);


      Appointment sophiaAppointment = new Appointment();
      sophiaAppointment.setPatient(sophia);
      sophiaAppointment.setDoctor(drKim);
      sophiaAppointment.setStartDateTime(
          today.plusDays(3).atTime(9, 0)
      );
      sophiaAppointment.setEndDateTime(
          today.plusDays(3).atTime(9, 30)
      );
      sophiaAppointment.setReason("Recurring headaches");
      sophiaAppointment.setStatus(AppointmentStatus.CONFIRMED);

      appointmentRepository.save(sophiaAppointment);


      /*
       * ---------------------------------------------------------
       * CONSULTATION
       * ---------------------------------------------------------
       */

      Consultation consultation = new Consultation();

      consultation.setAppointment(completed);
      consultation.setNotes(
          "Patient attended routine annual examination. " +
              "Vital signs reviewed and general physical examination completed."
      );
      consultation.setDiagnosis(
          "Hyperlipidemia; otherwise stable clinical examination."
      );

      consultation = consultationRepository.save(consultation);


      /*
       * ---------------------------------------------------------
       * PRESCRIPTION
       * ---------------------------------------------------------
       */

      Prescription prescription = new Prescription();

      prescription.setConsultation(consultation);
      prescription.setMedicationName("Atorvastatin");
      prescription.setDosage("20 mg");
      prescription.setInstructions(
          "Take one tablet orally once daily."
      );
      prescription.setPrescribedDate(today.minusDays(1));

      prescriptionRepository.save(prescription);


      System.out.println("======================================");
      System.out.println("MediFlow demo data created successfully");
      System.out.println("======================================");
      System.out.println("Doctor login:");
      System.out.println("dr.kim / Doctor@123");
      System.out.println("dr.mitchell / Doctor@123");
      System.out.println("dr.carter / Doctor@123");
      System.out.println("======================================");
    };
  }


  private Patient createPatient(
      String username,
      String firstName,
      String lastName,
      String email,
      String phone,
      LocalDate dateOfBirth,
      String address,
      PasswordEncoder passwordEncoder
  ) {

    Patient patient = new Patient();

    patient.setUsername(username);
    patient.setPasswordHash(
        passwordEncoder.encode("Patient@123")
    );

    patient.setEmail(email);
    patient.setPhoneNumber(phone);
    patient.setEnabled(true);
    patient.setRole(Role.PATIENT);

    patient.setFirstName(firstName);
    patient.setLastName(lastName);
    patient.setDateOfBirth(dateOfBirth);
    patient.setMailingAddress(address);

    return patient;
  }


  private void saveAvailability(
      AvailabilityRepository repository,
      Doctor doctor,
      DayOfWeek day,
      LocalTime start,
      LocalTime end
  ) {

    Availability availability = new Availability();

    availability.setDoctor(doctor);
    availability.setDayOfWeek(day);
    availability.setStartTime(start);
    availability.setEndTime(end);
    availability.setAvailable(true);

    repository.save(availability);
  }
}