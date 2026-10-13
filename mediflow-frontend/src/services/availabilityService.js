import api from "./api";

export const getDoctorAvailability = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/availability`);

  return response.data;
};

export const getDoctorAvailabilityByDay = async (doctorId, day) => {
  const response = await api.get(`/doctors/${doctorId}/availability`, {
    params: {
      day,
    },
  });

  return response.data;
};

export const createAvailability = async (doctorId, availability) => {
  const response = await api.post(
    `/doctors/${doctorId}/availability`,
    availability,
  );

  return response.data;
};
