import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Bell,
  User,
  Download,
  Share2,
  TrendingUp,
  Lightbulb,
  Zap,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import translations from "../translatations/translations";
import { getUser } from "../services/authService";
import { getHistory } from "../services/historyService";
import { useLanguage } from "../context/LanguageContext";
import { formatEnergy, parseEnergy } from "../utils/formatters";

function PredictionPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [prediction, setPrediction] = useState({
    totalUsage: 0,
    estimatedBill: 0,
    forecastMonth: "",
    percentage: 0,
  });

  const [lineData, setLineData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistory();
        const history = response.data;

        if (!history || history.length === 0) {
          return;
        }

        const chartData = [...history].reverse().map((item) => ({
          month: item.month,
          usage: parseEnergy(item.usage),
        }));
        setLineData(chartData);

        const current = history[0];
        const currUsage = parseEnergy(current.usage);
        const currBill = Number(current.bill) || 0;

        let percentageChange = 0;
        if (history.length > 1) {
          const previous = history[1];
          const prevUsage = parseEnergy(previous.usage);
          if (prevUsage !== 0) {
            percentageChange = Math.round(((currUsage - prevUsage) / prevUsage) * 100);
          }
        }

        setPrediction({
          totalUsage: currUsage,
          estimatedBill: currBill,
          forecastMonth: current.month || "",
          percentage: percentageChange,
        });

        setInsights([t.predictionComplete || "Prediksi selesai diproses oleh sistem."]);
        setRecommendations([{ title: t.unplugDevices || "Cabut perangkat", save: t.save30 || "Mencegah daya hantu (vampire draw)" }]);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else if (error.response && error.response.status !== 404) {
          console.error("Gagal mengambil data dari database:", error);
        }
      }
    };

    const loadUser = async () => {
      try {
        const result = await getUser();
        setUser(result);
      } catch (error) {
        console.error("Gagal memuat user:", error);
      }
    };

    fetchData();
    loadUser();
  }, [language, t, navigate]);

  const formatChange = (num) => (num > 0 ? `+${num}%` : `${num}%`);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold dark:text-white">
              {t.predictionResult || "Hasil Prediksi"}
            </h1>
            <p className="text-gray-400 mt-2">
              {t.energyOverview || "Ringkasan Penggunaan Energi"}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <Bell size={22} />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h2 className="font-bold dark:text-white">
                  {user ? (user.fullname || user.data?.fullname) : "Loading..."}
                </h2>
                <p className="text-gray-400 text-sm">
                  {t.premiumUser || "Premium User"}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                <User size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[30px] p-10 shadow-xl text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} />
              <p className="text-xl">
                {t.predictionComplete || "Prediksi Berhasil"}
              </p>
            </div>
            <h1 className="text-7xl font-bold mt-5">
              Rp{" "}
              {Number(prediction.estimatedBill).toLocaleString("id-ID")}
            </h1>
            <p className="text-blue-100 text-2xl mt-3">
              {t.estimatedNextBill || "Estimasi Tagihan Berikutnya"}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <HeroCard
                icon={<Zap size={22} />}
                title={t.predictedUsage || (language === "id" ? "Penggunaan" : "Usage")}
                value={formatEnergy(
                  prediction.totalUsage,
                  language === "id" ? "id-ID" : "en-US",
                )}
              />
              <HeroCard
                icon={<TrendingUp size={22} />}
                title={t.vsLastMonth || (language === "id" ? "Banding Bulan Lalu" : "vs Last Month")}
                value={formatChange(prediction.percentage)}
              />
              <HeroCard
                icon={<Calendar size={22} />}
                title={t.forecastPeriod || (language === "id" ? "Periode Prediksi" : "Forecast Period")}
                value={prediction.forecastMonth || "-"}
              />
            </div>

            <div className="flex gap-5 mt-8 flex-wrap">
              <button className="bg-white text-blue-600 px-7 py-4 rounded-2xl font-semibold flex items-center gap-3">
                <Download size={20} />
                {t.downloadReport || "Download Laporan"}
              </button>
              <button className="bg-blue-400/30 px-7 py-4 rounded-2xl font-semibold flex items-center gap-3">
                <Share2 size={20} />
                {t.share || "Bagikan"}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[30px] p-8 shadow-lg mt-8">
            <h2 className="text-4xl font-bold dark:text-white">
              {t.currentVsPredicted || "Saat Ini vs Prediksi"}
            </h2>
            <p className="text-gray-400 mt-2">
              {t.sixMonthComparison || "Perbandingan 6 Bulan Terakhir"}
            </p>
            <div className="h-[420px] mt-10">
              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                      dy={10} 
                    />
                    
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#2563eb"
                      strokeWidth={4}
                      dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#2563eb" }}
                      activeDot={{ r: 7, fill: "#2563eb", stroke: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                  Belum ada data grafik. Lakukan prediksi pertama Anda!
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-[#f4ebff] dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-[30px] p-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
                  <TrendingUp size={30} />
                </div>
                <h2 className="text-4xl font-bold dark:text-white">
                  {t.aiInsights || "Wawasan AI"}
                </h2>
              </div>
              <ul className="space-y-5 mt-8">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <InsightItem key={index} text={insight} />
                  ))
                ) : (
                  <p className="text-gray-500">Belum ada insight AI.</p>
                )}
              </ul>
            </div>

            <div className="bg-[#ecfdf3] dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[30px] p-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center">
                  <Lightbulb size={30} />
                </div>
                <h2 className="text-4xl font-bold dark:text-white">
                  {t.savingRecommendations || "Rekomendasi Hemat"}
                </h2>
              </div>
              <div className="space-y-6 mt-8">
                {recommendations.length > 0 ? (
                  recommendations.map((item, index) => (
                    <SavingItem
                      key={index}
                      title={item.title}
                      save={item.save}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">Belum ada rekomendasi.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroCard({ icon, title, value }) {
  return (
    <div className="bg-white/10 rounded-[24px] p-6">
      <div className="flex items-center gap-3 text-blue-100">
        {icon}
        <p>{title}</p>
      </div>
      <h2 className="text-5xl font-bold mt-5">{value}</h2>
    </div>
  );
}

function InsightItem({ text }) {
  return (
    <div className="flex gap-4">
      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-3"></div>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function SavingItem({ title, save }) {
  return (
    <div className="flex gap-4">
      <CheckCircle2 className="text-green-600 mt-1" size={24} />
      <div>
        <h2 className="font-semibold text-lg dark:text-white">{title}</h2>
        <p className="text-gray-400 mt-1">{save}</p>
      </div>
    </div>
  );
}

export default PredictionPage;
