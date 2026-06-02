import jsPDF from "jspdf";
import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";


function PredictionHero() {
  const { language } =
    useLanguage();

  const t =
    translations[language];
    
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.text(
      language === "id"
        ? "Laporan Prediksi Smart Energy"
        : "Smart Energy Prediction Report",
      20,
      20
    );

    doc.text(
      language === "id"
        ? "Tagihan Prediksi: Rp 480.000"
        : "Predicted Bill: Rp 480.000",
      20,
      40
    );

    doc.text(
      language === "id"
        ? "Penggunaan Prediksi: 350 kWh"
        : "Predicted Usage: 350 kWh",
      20,
      60
    );

    doc.save("smart-energy-report.pdf");
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[32px] p-8 text-white shadow-lg">

      <p className="text-sm opacity-80">
        {language === "id"
          ? "Prediksi Selesai"
          : "Prediction Complete"}
      </p>

      <h1 className="text-5xl font-bold mt-4">
        Rp 480.000
      </h1>

      <p className="opacity-80 mt-2">
        {language === "id"
          ? "Perkiraan tagihan listrik bulan depan"
          : "Estimated electricity bill next month"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

        <MiniCard
          title={
            language === "id"
              ? "Prediksi Penggunaan"
              : "Predicted Usage"
          }
          value="350 kWh"
        />

        <MiniCard
          title={
            language === "id"
              ? "vs Bulan Lalu"
              : "vs Last Month"
          }
          value="+12%"
        />

        <MiniCard
          title={
            language === "id"
              ? "Perkiraan"
              : "Forecast"
          }
          value="May 2026"
        />

      </div>

      <div className="flex flex-wrap gap-3 mt-8">

        <Button
          onClick={downloadReport}
          className="bg-white text-blue-600 px-5 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-all"
        >

          {language === "id"
            ? "Unduh Laporan"
            : "Download Report"}

        </Button>

        <Button className="bg-white/10 px-5 py-3 rounded-2xl hover:bg-white/20 transition-all">

          {language === "id"
            ? "Bagikan"
            : "Share"}

        </Button>

      </div>

    </div>
  );
}

function MiniCard({
  title,
  value,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">

      <p className="text-sm opacity-70">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

export default PredictionHero;