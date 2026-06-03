import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ FUNGSI SUBMIT SUDAH DIPERBAIKI (Tunggal & Clean Async)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi kecocokan password di sisi client
    if (form.password !== form.confirmPassword) {
      alert(t.passwordNotMatch || "Password tidak cocok!");
      return;
    }

    // 2. Map data agar sesuai dengan penamaan field di MySQL Backend (name, email, password)
    const userData = {
      name: form.fullname,
      email: form.email,
      password: form.password,
    };

    try {
      // 🚀 Melakukan HTTP POST request ke backend Node.js Anda
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        alert(t.registerSuccess || "Registrasi berhasil disimpan ke MySQL!");
        navigate("/login"); // Pindah ke halaman login
      } else {
        alert(`Gagal mendaftar: ${result.message}`);
      }
    } catch (error) {
      console.error("Error Koneksi API:", error);
      alert("Gagal terhubung ke server backend. Pastikan server Node.js (Port 5000) menyala!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] dark:bg-[#0f172a] p-6 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-xl transition-all">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            ⚡
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{t.smartEnergy}</h1>
            <p className="text-gray-400 text-sm">{t.loginDesc}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold dark:text-white">{t.createAccount}</h1>
        <p className="text-gray-400 mt-3 leading-relaxed">
          {t.registerDesc || "Daftar untuk mulai memantau dan memprediksi konsumsi listrik Anda secara cerdas."}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          {/* Fullname */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.fullName}</label>
            <input
              type="text"
              name="fullname"
              placeholder={t.enterFullName || "Masukkan nama lengkap"}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.emailAddress}</label>
            <input
              type="type"
              name="email"
              placeholder={t.enterEmail || "Masukkan email"}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.password}</label>
            <input
              type="password"
              name="password"
              placeholder={t.createPassword || "Buat password"}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">{t.confirmPassword}</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder={t.confirmYourPassword || "Konfirmasi password"}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg">
            {t.createAccount}
          </button>
        </form>

        {/* Footer */}
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