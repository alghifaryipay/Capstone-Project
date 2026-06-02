import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import translations from "../translatations/translations";

import { useLanguage } from "../context/LanguageContext";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function LoginPage() {

  const { login } = useAuth();

  const navigate =
    useNavigate();

  const { language } =
    useLanguage();

  const t =
    translations[language] ||
    translations.en;

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login(
      {
        email: form.email,
      },
      "dummy-token"
    );

    navigate("/dashboard");
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
        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >

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
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg">

            {t.signIn}

          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-8">

          {t.dontHaveAccount}

          <Link
            to="/register"
            className="text-blue-600 ml-2 font-medium"
          >
            {t.register}
          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginPage;