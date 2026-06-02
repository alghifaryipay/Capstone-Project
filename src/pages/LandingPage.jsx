import { Link } from "react-router-dom";
import translations from "../translatations/translations";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/ui/Button";

function LandingPage() {

  const { language } =
    useLanguage();

  // fallback supaya aman
  const t =
    translations[language] ||
    translations.en;

  return (
    <div className="bg-[#f5f7fb] dark:bg-[#0f172a] min-h-screen overflow-hidden transition-all">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 lg:px-16 py-5 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-all">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
            ⚡
          </div>

          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
            Smart Energy Predictor
          </h1>

        </div>

        {/* BUTTON */}
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          {t.getStarted}
        </Link>

      </nav>

      {/* HERO */}
      <section className="px-8 lg:px-16 pt-20 pb-28">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <h1 className="text-[64px] leading-[72px] font-bold text-[#111827] dark:text-white max-w-3xl">

              {t.heroTitle1}
              <br />
              {t.heroTitle2}

            </h1>

            <p className="text-gray-500 dark:text-gray-300 text-2xl leading-relaxed mt-8 max-w-2xl">

              {t.heroDesc}

            </p>

            {/* BUTTON */}
            <div className="mt-10">

              <Link
                to="/input"
                className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-10 py-5 rounded-2xl text-xl font-semibold shadow-2xl"
              >
                {t.startPredicting}
              </Link>

            </div>

            <p className="text-gray-400 dark:text-gray-500 mt-6 text-lg">
              {t.noCard}
            </p>

          </div>

          {/* RIGHT CARD */}
          <div className="relative">

            <div className="bg-[#eef4ff] dark:bg-slate-800 rounded-[36px] p-8 shadow-2xl transition-all">

              {/* TOP CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 shadow-sm transition-all">

                <div className="flex items-center gap-5">

                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl">
                    📊
                  </div>

                  <div>

                    <p className="text-gray-400 text-lg">
                      {t.monthlyPrediction}
                    </p>

                    <h2 className="text-5xl font-bold text-[#111827] dark:text-white mt-2">
                      Rp 450,000
                    </h2>

                  </div>

                </div>

                {/* PROGRESS */}
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full mt-8 overflow-hidden">

                  <div className="w-[72%] h-full bg-blue-600 rounded-full"></div>

                </div>

              </div>

              {/* BOTTOM */}
              <div className="grid grid-cols-2 gap-6 mt-6">

                {/* USAGE */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm transition-all">

                  <p className="text-gray-400 text-lg">
                    {t.usage}
                  </p>

                  <h2 className="text-4xl font-bold text-[#111827] dark:text-white mt-3">
                    320 kWh
                  </h2>

                </div>

                {/* SAVINGS */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm transition-all">

                  <p className="text-gray-400 text-lg">
                    {t.savings}
                  </p>

                  <h2 className="text-4xl font-bold text-green-500 mt-3">
                    15%
                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="px-8 lg:px-16 pb-28">

        <div className="text-center">

          <h1 className="text-6xl font-bold text-[#111827] dark:text-white">
            {t.whyChoose}
          </h1>

          <p className="text-gray-500 dark:text-gray-300 text-2xl mt-5">
            {t.featureDesc}
          </p>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">

          <FeatureCard
            icon="🧠"
            title={t.aiPrediction}
            desc={t.aiPredictionDesc}
          />

          <FeatureCard
            icon="💡"
            title={t.smartInsight}
            desc={t.smartInsightDesc}
          />

          <FeatureCard
            icon="📉"
            title={t.costSaving}
            desc={t.costSavingDesc}
          />

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-24 px-8 lg:px-16 text-white">

        <div className="text-center">

          <h1 className="text-6xl font-bold">
            {t.howWorks}
          </h1>

          <p className="text-blue-100 text-2xl mt-5">
            {t.howWorksDesc}
          </p>

        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">

          <StepCard
            number="1"
            title={t.step1}
            desc={t.step1Desc}
          />

          <StepCard
            number="2"
            title={t.step2}
            desc={t.step2Desc}
          />

          <StepCard
            number="3"
            title={t.step3}
            desc={t.step3Desc}
          />

        </div>

      </section>

      {/* CTA */}
      <section className="px-8 lg:px-16 py-24">

        <div className="bg-[#eef4ff] dark:bg-slate-800 rounded-[40px] py-20 px-10 text-center shadow-sm transition-all">

          <h1 className="text-6xl font-bold text-[#111827] dark:text-white">
            {t.readySave}
          </h1>

          <p className="text-gray-500 dark:text-gray-300 text-2xl mt-5">
            {t.readySaveDesc}
          </p>

          <div className="mt-10">

            <Link
              to="/input"
              className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-10 py-5 rounded-2xl text-xl font-semibold shadow-2xl"
            >
              {t.freePrediction}
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-slate-800 px-8 lg:px-16 py-8 bg-white dark:bg-slate-900 transition-all">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl">
              ⚡
            </div>

            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
              Smart Energy Predictor
            </h1>

          </div>

          <p className="text-gray-400 text-lg">

            {language === "id"
              ? "© 2026 Smart Energy Predictor. Semua hak dilindungi."
              : "© 2026 Smart Energy Predictor. All rights reserved."}

          </p>

        </div>

      </footer>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[28px] p-10 shadow-lg hover:shadow-2xl transition-all">

      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-4xl">
        {icon}
      </div>

      <h2 className="text-4xl font-bold text-[#111827] dark:text-white mt-8">
        {title}
      </h2>

      <p className="text-gray-500 dark:text-gray-300 text-xl leading-relaxed mt-6">
        {desc}
      </p>

    </div>
  );
}

function StepCard({
  number,
  title,
  desc,
}) {
  return (
    <div className="text-center">

      <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold mx-auto shadow-xl">
        {number}
      </div>

      <h2 className="text-4xl font-bold mt-8">
        {title}
      </h2>

      <p className="text-blue-100 text-xl leading-relaxed mt-5 max-w-sm mx-auto">
        {desc}
      </p>

    </div>
  );
}

export default LandingPage;