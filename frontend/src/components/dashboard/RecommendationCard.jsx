import { useLanguage } from "../../context/LanguageContext";

function RecommendationCard() {
  const { language } = useLanguage();

  const handleApply = () => {
    const message = language === "id"
      ? "✅ Rekomendasi diterapkan! Sistem AI akan memonitor penggunaan AC Anda."
      : "✅ Recommendation applied! The AI system will monitor your AC usage.";
    
    alert(message);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold dark:text-white mb-3">
          {language === "id" ? "Rekomendasi AI" : "AI Recommendation"}
        </h3>
        <p className="text-gray-500 dark:text-gray-300 mb-6 leading-relaxed">
          {language === "id"
            ? "Kurangi penggunaan AC antara jam 12:00 - 15:00 untuk menghemat sekitar Rp 120.000 per bulan."
            : "Reduce AC usage between 12 PM - 3 PM to save approximately Rp 120.000 per month."}
        </p>
      </div>
      
      <button
        onClick={handleApply}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all w-max active:scale-95 shadow-md"
      >
        {language === "id" ? "Terapkan Rekomendasi" : "Apply Recommendation"}
      </button>
    </div>
  );
}

export default RecommendationCard;
