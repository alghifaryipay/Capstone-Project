import { useEffect, useState } from "react";
import axios from "axios";
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
  const { language } = useLanguage();
  const t = translations[language];
    
  // State untuk menyimpan data dari database, awalnya kosong
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mengambil data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          // 👇 INI ADALAH BAGIAN YANG DIPERBAIKI 👇
          // Kita ubah data dari backend yang tadinya "250 kWh" menjadi angka murni 250
          const chartData = response.data.data.map((item) => ({
            month: item.month, // Tetap gunakan bulan dari backend
            usage: parseFloat(item.usage) || 0 // Membuang teks "kWh" dan mengambil angkanya saja
          }));
          
          setData(chartData);
          // 👆 SELESAI 👆
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data grafik dari backend:", error);
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