import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import translations from "../translatations/translations";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

// 1. Import fungsi loginUser yang terhubung ke Backend
import { loginUser } from "../services/authService"; 

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 2. Tambahkan state untuk Error dan Loading
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrorMsg(""); // Hilangkan pesan error saat user mengetik
  };

  // 3. Ubah handleSubmit menjadi async dan panggil backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tembak backend melalui authService
      const result = await loginUser(form);

      // result.data berisi { token: "...", user: {...} } dari backend
      const userData = result.data.user;
      const userToken = result.data.token;

      // Masukkan data asli ke dalam Context Auth
      login(userData, userToken);

      // Pindah ke halaman dashboard
      navigate("/dashboard");

    } catch (error) {
      // Tampilkan error dari backend (misal: "Email atau password salah!")
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
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

        {/* PESAN ERROR */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-5 text-sm font-medium">
            {errorMsg}
          </div>
        )}

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
          <button 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold transition-all shadow-lg text-white 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Memproses..." : t.signIn}
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
