import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function RecommendationCard() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        {language === "id"
          ? "Rekomendasi AI"
          : "AI Recommendation"}
      </h2>

      <p className="text-gray-500 mt-4 leading-relaxed">
        {language === "id"
          ? "Kurangi penggunaan AC antara pukul 12 siang - 3 sore untuk menghemat sekitar Rp 120.000 per bulan."
          : "Reduce AC usage between 12 PM - 3 PM to save approximately Rp 120.000 per month."}
      </p>

      <button className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-2xl">

        {language === "id"
          ? "Terapkan Rekomendasi"
          : "Apply Recommendation"}

      </button>

    </div>
  );
}

export default RecommendationCard;