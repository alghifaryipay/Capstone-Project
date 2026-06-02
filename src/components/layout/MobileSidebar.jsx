import {
  LayoutDashboard,
  FileInput,
  LineChart,
  History,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function MobileSidebar() {

  const { language } =
    useLanguage();

  const t =
    translations[language];

  const menus = [
    {
      name: t.dashboard,
      path: "/dashboard",
      icon:
        LayoutDashboard,
    },

    {
      name: t.inputData,
      path: "/input",
      icon: FileInput,
    },

    {
      name: t.prediction,
      path: "/prediction",
      icon: LineChart,
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-3 flex justify-between z-50">

      {menus.map(
        (menu, index) => {
          const Icon =
            menu.icon;

          return (
            <NavLink
              key={index}
              to={menu.path}
              className={({
                isActive,
              }) =>
                `flex flex-col items-center text-xs gap-1 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400"
                }`
              }
            >

              <Icon size={22} />

              <span>
                {menu.name}
              </span>

            </NavLink>
          );
        }
      )}

    </div>
  );
}

export default MobileSidebar;