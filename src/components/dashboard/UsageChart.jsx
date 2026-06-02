import {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import translations from "../../translatations/translations";

import { useLanguage } from "../../context/LanguageContext";

function UsageChart() {
  const { language } =
    useLanguage();

  const t =
    translations[language];
    
  const [data, setData] =
    useState([
      { 
        month:
          language === "id"
            ? "Jan"
            : "Jan",
        usage: 220 
      },

      { 
        month:
          language === "id"
            ? "Feb"
            : "Feb",
        usage: 260 
      },

      { 
        month:
          language === "id"
            ? "Mar"
            : "Mar",
        usage: 290 
      },

      { 
        month:
          language === "id"
            ? "Apr"
            : "Apr",
        usage: 310 
      },
    ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => [
        ...prev,
        {
          month: `M${prev.length + 1}`,
          usage:
            Math.floor(
              Math.random() * 400
            ),
        },
      ]);
    }, 5000);

    return () =>
      clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-semibold">
            {language === "id"
              ? "Penggunaan Saat Ini vs Prediksi"
              : "Current vs Predicted Usage"}
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            {language === "id"
              ? "Analitik listrik bulanan"
              : "Monthly electricity analytics"}
          </p>

        </div>

        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm">

          {language === "id"
            ? "Bulanan"
            : "Monthly"}

        </button>

      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <AreaChart data={data}>

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="usage"
            stroke="#2563eb"
            fill="#93c5fd"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default UsageChart;