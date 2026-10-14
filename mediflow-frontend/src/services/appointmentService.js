import api from "./api";

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);

  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/appointments/patient/${patientId}`);

  return response.data;
};

export const getDoctorAppointments = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);

  return response.data;
};

export const createAppointment = async (appointment) => {
  const response = await api.post("/appointments", appointment);

  return response.data;
};

export const rescheduleAppointment = async (id, appointment) => {
  const response = await api.put(`/appointments/${id}/reschedule`, appointment);

  return response.data;
};

export const confirmAppointment = async (id) => {
  const response = await api.patch(`/appointments/${id}/confirm`);

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.patch(`/appointments/${id}/cancel`);

  return response.data;
};

export const getAppointments = async () => {
  const response = await api.get("/appointments");

  return response.data;
};
