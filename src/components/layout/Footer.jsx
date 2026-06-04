import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function Footer() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <footer className="py-10 border-t border-gray-200">

      <div className="flex flex-col md:flex-row justify-between gap-6">

        <div>

          <h1 className="font-bold text-xl">
            Smart Energy
          </h1>

          <p className="text-gray-500 mt-2">

            {language === "id"
              ? "Platform prediksi listrik berbasis AI."
              : "AI-powered electricity prediction platform."}

          </p>

        </div>

        <div className="flex gap-8 text-gray-500">

          <a href="#">
            {language === "id"
              ? "Privasi"
              : "Privacy"}
          </a>

          <a href="#">
            {language === "id"
              ? "Syarat"
              : "Terms"}
          </a>

          <a href="#">
            {language === "id"
              ? "Kontak"
              : "Contact"}
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;