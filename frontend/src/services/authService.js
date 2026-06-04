import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/user`;

/* LOGIN */
export const loginUser = async (data) => {
  try {
    // Menembak rute login di backend
    const response = await axios.post(`${API_URL}/login`, data);
    
    // Jika backend merespons sukses, simpan Token ke localStorage
    const token = response.data.data.token;
    if (token) {
      localStorage.setItem("token", token);
      
      // Opsional: Simpan juga data user untuk jaga-jaga
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    // Menangkap pesan error dari backend (misal: "Password salah!")
    throw new Error(error.response?.data?.message || "Gagal melakukan login");
  }
};

/* REGISTER */
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal melakukan registrasi");
  }
};

/* GET USER PROFILE (Untuk Header & Prediction Page) */
export const getUser = async () => {
  try {
    // Ambil karcis masuk (token)
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Anda belum login");
    }

    // Tembak backend untuk minta data database terbaru
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Karena backend mereturn { status: "success", data: { fullname: "...", ... } }
    // Ini akan dibaca dengan sempurna oleh Header.jsx dan PredictionPage.jsx kamu
    return response.data; 
    
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil profil dari database");
  }
};

// Fungsi tambahan untuk logout jika kamu butuh nanti
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
