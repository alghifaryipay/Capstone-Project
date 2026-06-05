import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function NotificationCard() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-[32px] p-5 shadow-sm">

      <h2 className="font-semibold text-blue-600">
        {language === "id"
          ? "Notifikasi AI"
          : "AI Notification"}
      </h2>

      <p className="text-sm text-gray-600 mt-2">
        {language === "id"
          ? "Tagihan listrik Anda mungkin meningkat minggu depan karena penggunaan AC yang lebih tinggi."
          : "Your electricity bill may increase next week due to higher AC usage."}
      </p>

    </div>
  );
}

export default NotificationCard;