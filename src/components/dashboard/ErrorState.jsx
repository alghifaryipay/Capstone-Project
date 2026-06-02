import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function ErrorState() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <div className="bg-red-50 border border-red-100 rounded-[32px] p-6">

      <h2 className="text-red-500 font-semibold">

        {language === "id"
          ? "Gagal Memuat Prediksi"
          : "Failed to Load Prediction"}

      </h2>

      <p className="text-sm text-gray-500 mt-2">

        {language === "id"
          ? "Silakan coba lagi nanti."
          : "Please try again later."}

      </p>

    </div>
  );
}

export default ErrorState;