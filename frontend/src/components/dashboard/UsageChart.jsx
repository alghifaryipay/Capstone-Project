import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useLanguage } from "../../context/LanguageContext";
import { getHistory } from "../../services/historyService";
import { parseEnergy } from "../../utils/formatters";

function UsageChart() {
  const { language } = useLanguage();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getHistory();

        if (response.data) {
          const chartData = [...response.data].reverse().map((item) => ({
            month: item.month,
            usage: parseEnergy(item.usage),
          }));

          setData(chartData);
        }
      } catch (error) {
        console.error("Gagal mengambil data grafik dari backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
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
          {language === "id" ? "Bulanan" : "Monthly"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Loading chart data...
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Belum ada data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
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
      )}
    </div>
  );
}

export default UsageChart;
