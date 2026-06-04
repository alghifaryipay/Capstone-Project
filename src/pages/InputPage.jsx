import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import translations from "../translatations/translations";

import { useLanguage } from "../context/LanguageContext";

function InputPage() {

  const navigate =
    useNavigate();

  const { language } =
    useLanguage();

  const t =
    translations[language] ||
    translations.en;

  const [step, setStep] =
    useState(1);

  const [form, setForm] =
    useState({
      household: "",
      members: "",
      ac: "",
      tv: "",
      refrigerator: "",
      lighting: "",
      washingMachine: "",
      usageTime: "",
    });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handlePredict = async () => {
    try {
      // 1. Estimasi Daya (dalam kW) untuk masing-masing alat
      // Angka ini bisa kamu sesuaikan dengan daya rata-rata alat di dunia nyata
      const ac_kW = 0.4;        // 400 Watt
      const tv_kW = 0.1;        // 100 Watt
      const refrigerator_kW = 0.15; // 150 Watt
      const lighting_kW = 0.05;     // 50 Watt
      const washingMachine_kW = 0.3;// 300 Watt

      // 2. Kalkulasi total penggunaan per hari (kWh)
      const dailyKwh =
        (Number(form.ac || 0) * ac_kW) +
        (Number(form.tv || 0) * tv_kW) +
        (Number(form.refrigerator || 0) * refrigerator_kW) +
        (Number(form.lighting || 0) * lighting_kW) +
        (Number(form.washingMachine || 0) * washingMachine_kW);

      // 3. Kalkulasi total per bulan (asumsi 30 hari)
      const totalKwh = dailyKwh * 30;

      // 4. Dapatkan nama bulan depan untuk dikirim ke backend (misal: "July")
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const targetMonth = nextMonth.toLocaleString("en-US", { month: "long" });

      // 5. Susun payload sesuai permintaan Backend (kwh & month)
      const payload = {
        kwh: totalKwh,
        month: targetMonth
      };

      // 👇 TAMBAHKAN BARIS INI: Ambil token dari memori browser
      const token = localStorage.getItem("token");

      // 6. Kirim ke Backend menggunakan Axios
      const response = await axios.post("http://localhost:5000/api/predict", payload, {
        headers: {
          "Content-Type": "application/json",
          // 👇 TAMBAHKAN BARIS INI: Selipkan token sebagai surat izin
          "Authorization": `Bearer ${token}`
        }
      });

      // 7. Simpan hasil dari response.data.data (karena backend kamu pakai bungkus 'data: {}')
      localStorage.setItem(
        "prediction-result",
        JSON.stringify(response.data.data)
      );

      // 8. Pindah ke halaman hasil prediksi
      navigate("/prediction");

    } catch (error) {
      console.error("Gagal mengirim data ke backend:", error);
      alert(
        language === "id"
          ? "Terjadi kesalahan saat memproses data prediksi."
          : "An error occurred while processing prediction data."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a] transition-all">

      <Sidebar />

      <main className="flex-1 p-8">

        <Header />

        {/* TITLE */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold dark:text-white">

            {language === "id"
              ? "Input Data Listrik"
              : "Input Electricity Data"}

          </h1>

          <p className="text-gray-400 mt-3 text-lg">

            {language === "id"
              ? "Isi informasi penggunaan listrik rumah Anda"
              : "Fill in your household electricity usage information"}

          </p>

        </div>

        {/* STEPPER */}
        <div className="flex items-center justify-between mb-14">

          <StepItem
            active={step >= 1}
            number="1"
            title={
              language === "id"
                ? "Info Dasar"
                : "Basic Info"
            }
          />

          <div className="flex-1 h-2 bg-gray-200 mx-4 rounded-full overflow-hidden">

            <div
              className={`h-full bg-blue-600 transition-all ${step >= 2
                  ? "w-full"
                  : "w-0"
                }`}
            ></div>

          </div>

          <StepItem
            active={step >= 2}
            number="2"
            title={
              language === "id"
                ? "Peralatan"
                : "Appliances"
            }
          />

          <div className="flex-1 h-2 bg-gray-200 mx-4 rounded-full overflow-hidden">

            <div
              className={`h-full bg-blue-600 transition-all ${step >= 3
                  ? "w-full"
                  : "w-0"
                }`}
            ></div>

          </div>

          <StepItem
            active={step >= 3}
            number="3"
            title={
              language === "id"
                ? "Waktu Penggunaan"
                : "Usage Time"
            }
          />

        </div>

        {/* FORM CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-[36px] p-10 shadow-lg transition-all">

          {/* STEP 1 */}
          {step === 1 && (
            <div>

              <h2 className="text-4xl font-bold dark:text-white">

                {language === "id"
                  ? "Informasi Rumah"
                  : "Household Information"}

              </h2>

              <p className="text-gray-400 mt-3">

                {language === "id"
                  ? "Masukkan informasi dasar rumah Anda"
                  : "Enter your household basic information"}

              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

                <InputField
                  label={
                    language === "id"
                      ? "Ukuran Rumah"
                      : "Household Size"
                  }
                  name="household"
                  placeholder={
                    language === "id"
                      ? "Contoh: 120 m²"
                      : "Example: 120 m²"
                  }
                  onChange={handleChange}
                />

                <InputField
                  label={
                    language === "id"
                      ? "Jumlah Anggota Keluarga"
                      : "Family Members"
                  }
                  name="members"
                  placeholder="4"
                  onChange={handleChange}
                />

              </div>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>

              <h2 className="text-4xl font-bold dark:text-white">

                {language === "id"
                  ? "Penggunaan Peralatan"
                  : "Appliance Usage"}

              </h2>

              <p className="text-gray-400 mt-3">

                {language === "id"
                  ? "Masukkan durasi penggunaan peralatan harian"
                  : "Enter daily appliance usage duration"}

              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

                <InputField
                  label={
                    language === "id"
                      ? "AC (Jam)"
                      : "Air Conditioner (Hours)"
                  }
                  name="ac"
                  placeholder="8"
                  onChange={handleChange}
                />

                <InputField
                  label={
                    language === "id"
                      ? "Televisi (Jam)"
                      : "Television (Hours)"
                  }
                  name="tv"
                  placeholder="5"
                  onChange={handleChange}
                />

                <InputField
                  label={
                    language === "id"
                      ? "Kulkas"
                      : "Refrigerator"
                  }
                  name="refrigerator"
                  placeholder="24"
                  onChange={handleChange}
                />

                <InputField
                  label={
                    language === "id"
                      ? "Pencahayaan"
                      : "Lighting"
                  }
                  name="lighting"
                  placeholder="10"
                  onChange={handleChange}
                />

                <InputField
                  label={
                    language === "id"
                      ? "Mesin Cuci"
                      : "Washing Machine"
                  }
                  name="washingMachine"
                  placeholder="2"
                  onChange={handleChange}
                />

              </div>

            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>

              <h2 className="text-4xl font-bold dark:text-white">

                {language === "id"
                  ? "Waktu Penggunaan Listrik"
                  : "Electricity Usage Time"}

              </h2>

              <p className="text-gray-400 mt-3">

                {language === "id"
                  ? "Pilih waktu penggunaan listrik paling sering"
                  : "Select your most common electricity usage time"}

              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

                <UsageCard
                  title={
                    language === "id"
                      ? "Siang Hari"
                      : "Daytime"
                  }
                  selected={
                    form.usageTime ===
                    "day"
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      usageTime:
                        "day",
                    })
                  }
                />

                <UsageCard
                  title={
                    language === "id"
                      ? "Malam Hari"
                      : "Nighttime"
                  }
                  selected={
                    form.usageTime ===
                    "night"
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      usageTime:
                        "night",
                    })
                  }
                />

                <UsageCard
                  title={
                    language === "id"
                      ? "Campuran"
                      : "Mixed"
                  }
                  selected={
                    form.usageTime ===
                    "mixed"
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      usageTime:
                        "mixed",
                    })
                  }
                />

              </div>

            </div>
          )}

          {/* BUTTONS */}
          <div className="flex items-center justify-between mt-16">

            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-500 disabled:opacity-50"
            >

              {language === "id"
                ? "Kembali"
                : "Previous"}

            </button>

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-10 py-4 rounded-2xl font-semibold shadow-lg"
              >

                {language === "id"
                  ? "Lanjut"
                  : "Continue"}

              </button>
            ) : (
              <button
                onClick={handlePredict}
                className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-10 py-4 rounded-2xl font-semibold shadow-lg"
              >

                {language === "id"
                  ? "Prediksi Sekarang"
                  : "Predict Now"}

              </button>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

function StepItem({
  active,
  number,
  title,
}) {

  return (
    <div className="flex flex-col items-center">

      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all ${active
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-500"
          }`}
      >

        {number}

      </div>

      <p className="mt-3 font-semibold dark:text-white">

        {title}

      </p>

    </div>
  );
}

function InputField({
  label,
  name,
  placeholder,
  onChange,
}) {

  return (
    <div>

      <label className="block mb-3 font-semibold dark:text-white">

        {label}

      </label>

      <input
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white rounded-2xl p-5 outline-none focus:border-blue-500 transition-all"
      />

    </div>
  );
}

function UsageCard({
  title,
  selected,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className={`rounded-[32px] p-10 border-2 transition-all text-left ${selected
          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-slate-700"
        }`}
    >

      <div className="text-5xl">
        ⚡
      </div>

      <h2 className="text-3xl font-bold mt-6 dark:text-white">

        {title}

      </h2>

      <p className="text-gray-400 mt-4">

        Electricity usage during {title.toLowerCase()}

      </p>

    </button>
  );
}

export default InputPage;