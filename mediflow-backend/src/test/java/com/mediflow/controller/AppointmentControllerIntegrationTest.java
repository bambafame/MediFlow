package com.mediflow.controller;

import tools.jackson.databind.ObjectMapper;

import com.mediflow.dto.appointment.AppointmentResponse;
import com.mediflow.dto.appointment.CreateAppointmentRequest;

import com.mediflow.entity.AppointmentStatus;

import com.mediflow.security.AuthorizationService;
import com.mediflow.security.CustomUserDetailsService;
import com.mediflow.security.JwtService;
import com.mediflow.service.AppointmentService;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(AppointmentController.class)
class AppointmentControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  ObjectMapper objectMapper;

  @MockitoBean
  private AppointmentService appointmentService;

  @MockitoBean
  private AuthorizationService authorizationService;

  @MockitoBean
  private JwtService jwtService;

  @MockitoBean
  private CustomUserDetailsService customUserDetailsService;


  @Test
  void shouldReturnAppointmentById()
      throws Exception {

    LocalDateTime start = LocalDateTime.of(
        2026, 10, 20, 10, 0
    );

    LocalDateTime end = start.plusMinutes(30);


    AppointmentResponse response = new AppointmentResponse(
        10L, 1L, "John Smith", 2L
        , "Sarah Wilson", "Cardiology", start, end,
        "Routine checkup", AppointmentStatus.SCHEDULED,
        LocalDateTime.of(2026, 10, 17, 9, 0)
    );


    when(appointmentService.getAppointment(10L)).thenReturn(response);

    mockMvc.perform(
            get("/api/appointments/10")
                .with(user("admin").roles("ADMIN"))
        )

        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))

        .andExpect(
            jsonPath("$.appointmentId").value(10L)
        )

        .andExpect(
            jsonPath("$.patientId").value(1L)
        )

        .andExpect(
            jsonPath("$.patientName").value("John Smith")
        )

        .andExpect(
            jsonPath("$.doctorId").value(2L)
        )

        .andExpect(
            jsonPath("$.doctorName").value("Sarah Wilson")
        )

        .andExpect(
            jsonPath("$.status").value("SCHEDULED")
        );


    verify(appointmentService).getAppointment(10L);
  }

  @Test
  void shouldCreateAppointment()
      throws Exception {

    LocalDateTime start = LocalDateTime.of(
        2026, 10, 20, 10, 0
    );

    LocalDateTime end = start.plusMinutes(30);

    CreateAppointmentRequest request = new CreateAppointmentRequest(
        1L, 2L, start, end, "Routine checkup"
    );

    AppointmentResponse response = new AppointmentResponse(
            100L,
            1L,
            "John Smith",
            2L,
            "Sarah Wilson",
            "Cardiology",
            start,
            end,
            "Routine checkup",
            AppointmentStatus.SCHEDULED,
            LocalDateTime.now()
        );


    when(
        appointmentService.bookAppointment(
                any(CreateAppointmentRequest.class)
        )
    ).thenReturn(response);


    mockMvc.perform(
            post(
                "/api/appointments"
            ).with(
                user("admin").roles("ADMIN"))
                .contentType(APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(request)
                )
        )

        .andExpect(status().isCreated())

        .andExpect(
            jsonPath("$.appointmentId").value(100L)
        )

        .andExpect(
            jsonPath("$.patientName").value("John Smith")
        )

        .andExpect(
            jsonPath("$.doctorName").value("Sarah Wilson")
        )

        .andExpect(
            jsonPath("$.reason").value("Routine checkup")
        )

        .andExpect(
            jsonPath("$.status").value("SCHEDULED")
        );


    verify(appointmentService).bookAppointment(any(CreateAppointmentRequest.class));
  }

  @Test
  void shouldConfirmAppointment() throws Exception {

    LocalDateTime start = LocalDateTime.of(
        2026, 10, 20, 10, 0
    );


    AppointmentResponse response = new AppointmentResponse(
            10L,
            1L,
            "John Smith",
            2L,
            "Sarah Wilson",
            "Cardiology",
            start,
            start.plusMinutes(30),
            "Routine checkup",
            AppointmentStatus.CONFIRMED,
            LocalDateTime.now()
        );


    when(appointmentService.confirmAppointment(10L)).thenReturn(response);


    mockMvc.perform(
            patch("/api/appointments/10/confirm")
                .with(
                    user("reception").roles("RECEPTIONIST")
                )
        )

        .andExpect(status().isOk())

        .andExpect(jsonPath("$.status").value("CONFIRMED"));


    verify(appointmentService).confirmAppointment(10L);
  }


}