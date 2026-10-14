import api from "./api";

export const createConsultation = async (consultation) => {
  const response = await api.post("/consultations", consultation);

  return response.data;
};

export const getConsultationByAppointment = async (appointmentId) => {
  const response = await api.get(`/consultations/appointment/${appointmentId}`);

  return response.data;
};
