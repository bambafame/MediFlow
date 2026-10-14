import api from "./api";

export const createPrescription = async (prescription) => {
  const response = await api.post("/prescriptions", prescription);

  return response.data;
};

export const getPrescriptionById = async (id) => {
  const response = await api.get(`/prescriptions/${id}`);

  return response.data;
};

export const getPatientPrescriptions = async (patientId) => {
  const response = await api.get(`/prescriptions/patient/${patientId}`);

  return response.data;
};

export const getConsultationPrescriptions = async (consultationId) => {
  const response = await api.get(
    `/prescriptions/consultation/${consultationId}`,
  );

  return response.data;
};
