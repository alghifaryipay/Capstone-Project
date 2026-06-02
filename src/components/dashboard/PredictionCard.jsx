import { motion } from "framer-motion";

import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function PredictionCard() {

  const { language } =
    useLanguage();

  const t =
    translations[language];

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
        Rp 480.000
      </h1>

      <p className="mt-2 opacity-80">
        {t.estimatedNextBill}
      </p>

      <div className="grid grid-cols-3 gap-4 mt-8">

        <StatCard
          title={t.predictedUsage}
          value="350 kWh"
        />

        <StatCard
          title={t.vsLastMonth}
          value="+12%"
        />

        <StatCard
          title={t.forecast}
          value="May 2026"
        />

      </div>

    </motion.div>
  );
}

function StatCard({
  title,
  value,
}) {
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