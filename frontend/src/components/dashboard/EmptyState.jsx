import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function EmptyState() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <div className="bg-white rounded-[32px] p-10 text-center shadow-sm">

      <h2 className="text-2xl font-bold">

        {language === "id"
          ? "Belum Ada Prediksi"
          : "No Prediction Yet"}

      </h2>

      <p className="text-gray-400 mt-2">

        {language === "id"
          ? "Buat prediksi AI pertama Anda"
          : "Generate your first AI prediction"}

      </p>

    </div>
  );
}

export default EmptyState;