package com.mediflow.dto;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.patient.PatientResponse;
import java.util.List;

public record DashboardResponse(

    String role,

    Long totalPatients,
    Long totalDoctors,

    long totalAppointments,
    long scheduledAppointments,
    long confirmedAppointments,
    long completedAppointments,
    long cancelledAppointments,

    List<AppointmentResponse> todayAppointments,
    List<AppointmentResponse> upcomingAppointments,

    List<PatientResponse> recentPatients

) {
}