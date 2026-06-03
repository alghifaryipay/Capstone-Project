import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import translations from "../translatations/translations";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = translations[language] || translations.en;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ FUNGSI SUBMIT SUDAH TERINTEGRASI DATABASE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🚀 Melakukan request POST ke endpoint login backend Express Anda
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        // Simpan data asli dari MySQL (id, name, email) ke dalam AuthContext
        login(
          {
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
          },
          "real-session-token"
        );

        alert(t.loginSuccess || "Login Berhasil!");
        navigate("/dashboard"); // Pindah ke dashboard utama
      } else {
        // Muncul kalau email tidak terdaftar atau password di phpMyAdmin salah
        alert(`Gagal Login: ${result.message}`);
      }
    } catch (error) {
      console.error("Error Koneksi API Login:", error);
      alert("Gagal terhubung ke server backend. Pastikan server Node.js (Port 5000) menyala!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] dark:bg-[#0f172a] p-6 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-xl transition-all">
        
        {/* LOGO */}
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

        {/* TITLE */}
        <h1 className="text-4xl font-bold dark:text-white">
          {t.login}
        </h1>
        <p className="text-gray-400 mt-3 leading-relaxed">
          {t.loginWelcome}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          
          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">
              {t.emailAddress}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t.enterEmail}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">
              {t.password}
            </label>
            <input
              type="password"
              name="password"
              placeholder={t.enterPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* BUTTON */}
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg">
            {t.signIn}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-8">
          {t.dontHaveAccount}
          <Link to="/register" className="text-blue-600 ml-2 font-medium">
            {t.register}
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;