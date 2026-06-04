import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";

function CTASection() {
  const { language } =
    useLanguage();

  const t =
    translations[language];

  return (
    <section className="py-24">

      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[40px] p-16 text-center text-white">

        <h1 className="text-5xl font-bold leading-tight">

          {language === "id"
            ? "Mulai Hemat Energi Hari Ini"
            : "Start Saving Energy Today"}

        </h1>

        <p className="opacity-80 mt-6 text-lg">

          {language === "id"
            ? "Bergabunglah dengan ribuan rumah tangga yang menggunakan AI untuk mengurangi tagihan listrik."
            : "Join thousands of households using AI to reduce electricity bills."}

        </p>

        <Button className="bg-white text-blue-600 px-8 py-4 rounded-2xl mt-10 font-semibold">

          {language === "id"
            ? "Coba Dashboard"
            : "Try Dashboard"}

        </Button>

      </div>

    </section>
  );
}

export default CTASection;