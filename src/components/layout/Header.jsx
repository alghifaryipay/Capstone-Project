import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function Header() {

  const { language } =
    useLanguage();

  const t =
    translations[language] ||
    translations.en;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      <div>

        <h1 className="text-3xl font-bold text-black dark:text-white">
          {t.dashboard}
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-2">
          {t.dashboardDesc}
        </p>

      </div>

      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder={t.searchHistory}
          className="bg-white dark:bg-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-3 outline-none"
        />

        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          JD
        </div>

      </div>

    </header>
  );
}

export default Header;