import {
  AlertTriangle,
} from "lucide-react";

import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function WarningCard() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <div className="bg-red-50 rounded-[32px] p-6">

      <div className="flex items-center gap-3">

        <div className="bg-red-100 p-3 rounded-2xl">
          <AlertTriangle className="text-red-500" />
        </div>

        <div>

          <h2 className="font-semibold">
            {language === "id"
              ? "Peringatan Penggunaan Tinggi"
              : "High Usage Warning"}
          </h2>

          <p className="text-sm text-gray-500">
            {language === "id"
              ? "Konsumsi di atas rata-rata"
              : "Above average consumption"}
          </p>

        </div>

      </div>

      <p className="mt-6 text-gray-600 leading-relaxed">
        {language === "id"
          ? "Penggunaan listrik Anda melebihi rata-rata lingkungan sebesar 18%."
          : "Your electricity usage exceeds the neighborhood average by 18%."}
      </p>

    </div>
  );
}

export default WarningCard;