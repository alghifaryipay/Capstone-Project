import {
  Home,
  BarChart3,
  History,
  Settings,
  LogOut,
  Database,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { language } =
    useLanguage();

  const { logout } = useAuth();

  const t =
    translations[language] ||
    translations.en;

  const menus = [
    {
      name: t.dashboard,
      path: "/dashboard",
      icon: Home,
    },
    {
      name: t.inputData,
      path: "/input",
      icon: Database,
    },
    {
      name: t.prediction,
      path: "/prediction",
      icon: BarChart3,
    },
    {
      name: t.history,
      path: "/history",
      icon: History,
    },
    {
      name: t.settings,
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 min-h-screen px-6 py-8 transition-all">

      {/* LOGO */}
      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          ⚡
        </div>

        <div>

          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
            Smart Energy
          </h1>

          <p className="text-gray-400 text-sm">
            AI Predictor
          </p>

        </div>

      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-3 mt-12">

        {menus.map((menu) => {
          const Icon =
            menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-medium
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800"
                }`
              }
            >

              <Icon size={22} />

              <span>
                {menu.name}
              </span>

            </NavLink>
          );
        })}

      </nav>

      {/* FOOTER */}
      <div className="mt-auto">

        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium">

          <LogOut size={22} />

          <span>
            {t.logout}
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;