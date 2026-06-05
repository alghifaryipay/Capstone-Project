import api from "./api";

export const loginUser = async (data) => {
  try {
    const response = await api.post("/user/login", data);
    const token = response.data.data.token;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal melakukan login");
  }
};

export const registerUser = async (data) => {
  try {
    const response = await api.post("/user/register", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal melakukan registrasi");
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil profil dari database");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
