import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import translations from "../../translatations/translations";
import { useLanguage } from "../../context/LanguageContext";

function PredictionCard() {
  const { language } = useLanguage();
  const t = translations[language];

  // State untuk menyimpan data prediksi terbaru
  const [prediction, setPrediction] = useState({
    bill: 0,
    usage: 0,
    month: "-", 
    loading: true,
  });

  // Ambil data dari endpoint /api/history yang sudah terbukti berhasil
  useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setPrediction((prev) => ({ ...prev, loading: false }));
          return;
        }

        // Kita gunakan endpoint history!
        const response = await axios.get("http://localhost:5000/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const historyArray = response.data.data;

        // Jika ada datanya, kita ambil urutan yang paling akhir
        if (historyArray && historyArray.length > 0) {
          const latestData = historyArray[historyArray.length - 1];

          setPrediction({
            usage: parseFloat(latestData.usage) || 0, // Buang teks " kWh" jadi angka murni
            bill: Number(latestData.bill) || 0,
            month: latestData.month || "May 2026",
            loading: false,
          });
        } else {
          setPrediction((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Gagal mengambil data prediksi terbaru:", error);
        setPrediction((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchLatestPrediction();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-[32px] p-8 text-white"
    >
      <p className="opacity-80">
        {t.predictionComplete}
      </p>

      {/* Menampilkan Tagihan Dinamis */}
      <h1 className="text-6xl font-bold mt-4">
        {prediction.loading 
          ? "..." 
          : `Rp ${prediction.bill.toLocaleString("id-ID")}`}
      </h1>

      <p className="mt-2 opacity-80">
        {t.estimatedNextBill}
      </p>

      <div className="grid grid-cols-3 gap-4 mt-8">
        
        {/* Menampilkan Penggunaan Dinamis */}
        <StatCard
          title={t.predictedUsage}
          value={prediction.loading ? "..." : `${prediction.usage} kWh`}
        />

        <StatCard
          title={t.vsLastMonth}
          value="+12%" // Bisa dibiarkan statis dulu
        />

        {/* Menampilkan Bulan Dinamis */}
        <StatCard
          title={t.forecast}
          value={prediction.loading ? "..." : prediction.month}
        />

      </div>
    </motion.div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl">
      <p className="text-sm opacity-70">
        {title}
      </p>
      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}

export default PredictionCard;