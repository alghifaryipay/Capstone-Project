import api from "./api";

export const createPrediction = async (data) => {
  const response = await api.post("/predict", data);

  return response.data;
};

export const getPredictions = async () => {
  const response = await api.get("/predict/latest");

  return response.data;
};
