import api from "./api";

export const getSpecializations = async () => {
  const response = await api.get("/specializations");
  return response.data;
};

export const getSpecializationById = async (id) => {
  const response = await api.get(`/specializations/${id}`);
  return response.data;
};

export const createSpecialization = async (specialization) => {
  const response = await api.post("/specializations", specialization);

  return response.data;
};
