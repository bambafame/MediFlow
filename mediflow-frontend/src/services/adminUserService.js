import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/admin/users");

  return response.data;
};

export const createReceptionist = async (data) => {
  const response = await api.post("/admin/receptionists", data);

  return response.data;
};

export const updateUserEnabled = async (userId, enabled) => {
  const response = await api.patch(`/admin/users/${userId}/enabled`, {
    enabled,
  });

  return response.data;
};
