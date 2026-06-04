import {
  ArrowRight,
} from "lucide-react";

import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function HeroSection() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <section className="grid lg:grid-cols-2 gap-10 items-center py-20">

      <div>

        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm mb-6">

          {language === "id"
            ? "Analitik Energi Berbasis AI"
            : "AI Powered Energy Analytics"}

        </div>

        <h1 className="text-6xl font-bold leading-tight">

          {language === "id"
            ? "Prediksi Penggunaan"
            : "Predict Your"}

          <span className="text-blue-600">

            {language === "id"
              ? " Listrik"
              : " Electricity Usage"}

          </span>

          {language === "id"
            ? " Lebih Cerdas"
            : " Smarter"}

        </h1>

        <p className="text-gray-500 text-lg mt-6 leading-relaxed">

          {language === "id"
            ? "Pantau konsumsi listrik, prediksi tagihan masa depan, dan optimalkan penggunaan energi rumah tangga menggunakan AI."
            : "Monitor electricity consumption, predict future bills, and optimize household energy usage using AI."}

        </p>

        <div className="flex gap-4 mt-10">

          <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl flex items-center gap-2">

            {language === "id"
              ? "Mulai Sekarang"
              : "Get Started"}

            <ArrowRight size={18} />

          </button>

          <button className="border border-gray-200 px-6 py-4 rounded-2xl">

            {language === "id"
              ? "Pelajari Lebih Lanjut"
              : "Learn More"}

          </button>

        </div>

        <div className="flex gap-10 mt-12">

          <div>

            <h2 className="text-3xl font-bold">
              10K+
            </h2>

            <p className="text-gray-500">

              {language === "id"
                ? "Pengguna Aktif"
                : "Active Users"}

            </p>

          </div>

          <div>

            <h2 className="text-3xl font-bold">
              95%
            </h2>

            <p className="text-gray-500">

              {language === "id"
                ? "Akurasi Prediksi"
                : "Prediction Accuracy"}

            </p>

          </div>

          <div>

            <h2 className="text-3xl font-bold">
              30%
            </h2>

            <p className="text-gray-500">

              {language === "id"
                ? "Penghematan Energi"
                : "Energy Savings"}

            </p>

          </div>

        </div>

      </div>

      <div className="relative">

        <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-[40px] p-8 shadow-2xl">

          <div className="bg-white rounded-3xl p-6">

            <h2 className="font-semibold mb-4">

              {language === "id"
                ? "Prediksi Bulanan"
                : "Monthly Prediction"}

            </h2>

            <div className="h-56 bg-blue-50 rounded-2xl"></div>

            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="bg-blue-50 p-4 rounded-2xl">

                <p className="text-sm text-gray-500">

                  {language === "id"
                    ? "Prediksi Tagihan"
                    : "Predicted Bill"}

                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Rp 480K
                </h2>

              </div>

              <div className="bg-green-50 p-4 rounded-2xl">

                <p className="text-sm text-gray-500">

                  {language === "id"
                    ? "Penghematan"
                    : "Savings"}

                </p>

                <h2 className="text-2xl font-bold mt-2 text-green-600">
                  18%
                </h2>

              </div>

            </div>

          </div>

        </div>

        <div className="absolute -bottom-6 -left-6 bg-white shadow-lg p-5 rounded-3xl">

          <p className="text-sm text-gray-500">

            {language === "id"
              ? "Insight AI"
              : "AI Insight"}

          </p>

          <h2 className="font-semibold mt-2">

            {language === "id"
              ? "Penggunaan AC Tinggi Terdeteksi"
              : "High AC Usage Detected"}

          </h2>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;