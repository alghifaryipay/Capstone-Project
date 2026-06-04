import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import translations from "../translatations/translations";
import Button from "../components/ui/Button";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext"; // 👈 Import ini agar fungsi logout seragam

function SettingsPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth(); // 👈 Gunakan fungsi dari Context

  const t = translations[language];

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
  });

  /* LOAD SETTINGS & USER DATA */
  useEffect(() => {
    // Load Theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    // Load User dari sistem Auth yang baru
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setProfile({
        fullname: savedUser.fullname || "",
        email: savedUser.email || "",
      });
    }
  }, []);

  /* DARK MODE TOGGLE */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = () => {
    // Update data di localStorage Frontend
    const savedUser = JSON.parse(localStorage.getItem("user"));
    
    if (savedUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...savedUser,
          fullname: profile.fullname,
          email: profile.email,
        })
      );
    }

    alert(
      language === "id"
        ? "Pengaturan berhasil disimpan di perangkat ini!"
        : "Settings saved successfully on this device!"
    );
  };

  const handleLogout = () => {
    // Gunakan fungsi bawaan AuthContext agar token juga terhapus
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a] transition-all">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold dark:text-white">
            {t.settings}
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            {t.managePreferences}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PROFILE */}
            <div className="bg-white dark:bg-slate-800 rounded-[36px] p-8 shadow-lg">
              <h2 className="text-3xl font-bold dark:text-white">
                {t.profileInformation}
              </h2>
              <p className="text-gray-400 mt-3">
                {t.updateProfile}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <InputField
                  label="Full Name"
                  name="fullname"
                  value={profile.fullname}
                  onChange={handleChange}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* PREFERENCES */}
            <div className="bg-white dark:bg-slate-800 rounded-[36px] p-8 shadow-lg">
              <h2 className="text-3xl font-bold dark:text-white">
                {t.preferences}
              </h2>
              <p className="text-gray-400 mt-3">
                {t.customizeExperience}
              </p>

              <div className="space-y-8 mt-10">
                {/* DARK MODE */}
                <ToggleCard
                  title={t.darkMode}
                  desc="Enable dark appearance mode"
                  enabled={darkMode}
                  onToggle={() => setDarkMode(!darkMode)}
                />

                {/* NOTIFICATIONS */}
                <ToggleCard
                  title={t.notifications}
                  desc="Receive prediction updates and alerts"
                  enabled={notifications}
                  onToggle={() => setNotifications(!notifications)}
                />

                {/* LANGUAGE */}
                <div className="flex items-center justify-between bg-[#f5f7fb] dark:bg-slate-700 rounded-[28px] p-6">
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">
                      {t.language}
                    </h2>
                    <p className="text-gray-400 mt-2">
                      {language === "id"
                        ? "Ubah bahasa aplikasi"
                        : "Change application language"}
                    </p>
                  </div>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="appearance-none px-5 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white outline-none font-semibold min-w-[180px] shadow-sm"
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="id">🇮🇩 Indonesia</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* EMAIL */}
                <ToggleCard
                  title="Email Notifications"
                  desc="Receive reports through email"
                  enabled={emailNotif}
                  onToggle={() => setEmailNotif(!emailNotif)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            
            {/* PROFILE CARD */}
            <div className="bg-white dark:bg-slate-800 rounded-[36px] p-8 shadow-lg">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-5xl mx-auto">
                👤
              </div>
              <h2 className="text-3xl font-bold text-center mt-6 dark:text-white">
                {profile.fullname || "User"}
              </h2>
              <p className="text-gray-400 text-center mt-3">
                Smart Energy User
              </p>

              <div className="mt-10 space-y-5">
                <button
                  onClick={saveSettings}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-4 rounded-2xl font-semibold shadow-lg"
                >
                  {t.saveSettings}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 transition-all text-white py-4 rounded-2xl font-semibold shadow-lg"
                >
                  {t.logout}
                </button>
              </div>
            </div>

            {/* SYSTEM INFO */}
            <div className="bg-white dark:bg-slate-800 rounded-[36px] p-8 shadow-lg">
              <h2 className="text-3xl font-bold dark:text-white">
                {t.systemInfo}
              </h2>
              <div className="space-y-6 mt-8">
                <InfoItem label="Version" value="v1.0.0" />
                <InfoItem label="AI Status" value="Active" />
                <InfoItem label="Database" value="Connected" />
                <InfoItem label="Server" value="Online" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block mb-3 font-semibold dark:text-white">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-5 outline-none focus:border-blue-500 transition-all"
      />
    </div>
  );
}

function ToggleCard({ title, desc, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between bg-[#f5f7fb] dark:bg-slate-700 rounded-[28px] p-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-white">
          {title}
        </h2>
        <p className="text-gray-400 mt-2">
          {desc}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`w-20 h-11 rounded-full relative transition-all ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full bg-white absolute top-1.5 transition-all ${
            enabled ? "left-10" : "left-1.5"
          }`}
        ></div>
      </button>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-gray-400">
        {label}
      </p>
      <h2 className="font-bold dark:text-white">
        {value}
      </h2>
    </div>
  );
}

export default SettingsPage;