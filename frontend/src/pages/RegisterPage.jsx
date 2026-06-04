import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // 👈 1. Import Axios
import { useLanguage } from "../context/LanguageContext";
import translations from "../translatations/translations";

function RegisterPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // State untuk menampilkan pesan error/loading (Opsional tapi direkomendasikan)
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrorMsg(""); // Hapus pesan error saat user mulai mengetik lagi
  };

  // 👈 2. Ubah handleSubmit menjadi async
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Password
    if (form.password !== form.confirmPassword) {
      setErrorMsg(t.passwordNotMatch || "Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      // Siapkan data yang mau dikirim ke backend (sesuaikan nama propertinya dengan yg diminta backend)
      const userData = {
        fullname: form.fullname,
        email: form.email,
        password: form.password,
      };

      // Tembak endpoint Register backend kamu (Ganti URL-nya jika berbeda)
      const response = await axios.post("http://localhost:5000/api/user/register", userData);

      // Jika berhasil, beri tahu user lalu arahkan ke halaman login
      alert(t.registerSuccess || "Registrasi berhasil! Silakan login.");
      navigate("/login");

    } catch (error) {
      console.error("Error saat register:", error);
      
      // Ambil pesan error dari backend jika ada (misal: "Email sudah terdaftar")
      const backendError = error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
      setErrorMsg(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] dark:bg-[#0f172a] p-6 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-xl transition-all">
        {/* Logo & Header tetap sama */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            ⚡
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {t.smartEnergy}
            </h1>
            <p className="text-gray-400 text-sm">
              {t.loginDesc}
            </p>
          </div>
        </div>

        <h1 className="text-4xl font-bold dark:text-white">
          {t.createAccount}
        </h1>
        <p className="text-gray-400 mt-3 leading-relaxed">
          {t.registerDesc || "Daftar untuk mulai memantau dan memprediksi konsumsi listrik Anda secara cerdas."}
        </p>

        {/* 👇 Tampilkan Error Message jika ada */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          {/* Input Fullname, Email, Password, ConfirmPassword tetap SAMA persis seperti kodemu */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.fullName}</label>
            <input type="text" name="fullname" placeholder={t.enterFullName || "Masukkan nama lengkap"} onChange={handleChange} required className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"/>
          </div>

          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.emailAddress}</label>
            <input type="email" name="email" placeholder={t.enterEmail || "Masukkan email"} onChange={handleChange} required className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"/>
          </div>

          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.password}</label>
            <input type="password" name="password" placeholder={t.createPassword || "Buat password"} onChange={handleChange} required className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"/>
          </div>

          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.confirmPassword}</label>
            <input type="password" name="confirmPassword" placeholder={t.confirmYourPassword || "Konfirmasi password"} onChange={handleChange} required className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"/>
          </div>

          {/* Button Submit dengan status Loading */}
          <button 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold transition-all shadow-lg text-white 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Memproses..." : t.createAccount}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          {t.alreadyHaveAccount}
          <Link to="/login" className="text-blue-600 ml-2 font-medium">
            {t.login}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;