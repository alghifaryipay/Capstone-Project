import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import translations from "../../translatations/translations";
import { useLanguage } from "../../context/LanguageContext";
import { getHistory } from "../../services/historyService";
import { formatEnergy, parseEnergy } from "../../utils/formatters";

function PredictionCard() {
  const { language } = useLanguage();
  const t = translations[language];

  const [prediction, setPrediction] = useState({
    bill: 0,
    usage: 0,
    month: "-", 
    loading: true,
  });

  useEffect(() => {
    const fetchLatestPrediction = async () => {
      try {
        const response = await getHistory();
        const historyArray = response.data;

        if (historyArray && historyArray.length > 0) {
          const latestData = historyArray[0];

          setPrediction({
            usage: parseEnergy(latestData.usage),
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

      <h1 className="text-6xl font-bold mt-4">
        {prediction.loading 
          ? "..." 
          : `Rp ${prediction.bill.toLocaleString("id-ID")}`}
      </h1>

      <p className="mt-2 opacity-80">
        {t.estimatedNextBill}
      </p>

      <div className="grid grid-cols-3 gap-4 mt-8">
        
        <StatCard
          title={t.predictedUsage}
          value={
            prediction.loading
              ? "..."
              : formatEnergy(prediction.usage, language === "id" ? "id-ID" : "en-US")
          }
        />

        <StatCard
          title={t.vsLastMonth}
          value="+12%"
        />

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
