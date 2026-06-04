import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import UsageChart from "../components/dashboard/UsageChart";
import InsightCard from "../components/dashboard/InsightCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import WarningCard from "../components/dashboard/WarningCard";
import NotificationCard from "../components/dashboard/NotificationCard";
import translations from "../translatations/translations";

import { useLanguage } from "../context/LanguageContext";

function DashboardPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    usage: 0,
    bill: 0,
    efficiency: 0,
    carbonImpact: 0,
    usageChange: 0,
    billChange: 0,
    efficiencyChange: 0,
    carbonChange: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const history = response.data.data;

        if (!history || history.length === 0) {
          setDashboardData((prev) => ({ ...prev, loading: false }));
          return;
        }

        const current = history[history.length - 1];
        const currUsage = parseFloat(current.usage) || 0;
        const currBill = Number(current.bill) || 0;
        
        const currCarbon = Math.round(currUsage * 0.85);  
        let currEff = 100 - Math.round((currUsage / 300) * 100);
        currEff = currEff < 5 ? 5 : (currEff > 100 ? 100 : currEff);

        let usageChange = 0, billChange = 0, efficiencyChange = 0, carbonChange = 0;

        if (history.length > 1) {
          const previous = history[history.length - 2];
          const prevUsage = parseFloat(previous.usage) || 0;
          const prevBill = Number(previous.bill) || 0;
          
          const prevCarbon = Math.round(prevUsage * 0.85);
          let prevEff = 100 - Math.round((prevUsage / 300) * 100);
          prevEff = prevEff < 5 ? 5 : (prevEff > 100 ? 100 : prevEff);

          const calcChange = (curr, prev) => prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100);

          usageChange = calcChange(currUsage, prevUsage);
          billChange = calcChange(currBill, prevBill);
          efficiencyChange = calcChange(currEff, prevEff);
          carbonChange = calcChange(currCarbon, prevCarbon);
        }

        setDashboardData({
          usage: currUsage,
          bill: currBill,
          efficiency: currEff,
          carbonImpact: currCarbon,
          usageChange,
          billChange,
          efficiencyChange,
          carbonChange,
          loading: false,
        });

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setDashboardData((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const formatChange = (num) => (num > 0 ? `+${num}%` : `${num}%`);

  return (
    <div className="flex bg-[#f7f9fc] dark:bg-[#0f172a] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <MobileSidebar />
        <Header />

        <div className="space-y-6 mt-6">
          {/* ANALYTICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            <InsightCard
              title={t.totalUsage || "Total Usage"}
              value={dashboardData.loading ? "..." : `${dashboardData.usage} kWh`}
              increase={formatChange(dashboardData.usageChange)}
            />

            <InsightCard
              title={t.estimatedBill || "Estimated Bill"}
              value={dashboardData.loading ? "..." : `Rp ${dashboardData.bill.toLocaleString("id-ID")}`}
              increase={formatChange(dashboardData.billChange)}
            />

            <InsightCard
              title={t.efficiency || "Efficiency"}
              value={dashboardData.loading ? "..." : `${dashboardData.efficiency}%`}
              increase={formatChange(dashboardData.efficiencyChange)}
            />

            <InsightCard
              title={t.carbonImpact || "Carbon Impact"}
              value={dashboardData.loading ? "..." : `${dashboardData.carbonImpact}kg`}
              increase={formatChange(dashboardData.carbonChange)}
            />

          </div>

          {/* CHART & RECOMMENDATION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <UsageChart />
            </div>
            <RecommendationCard />
          </div>

          {/* WARNING & NOTIFICATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WarningCard />
            <NotificationCard />
          </div>

          {/* BANNER */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[32px] p-8 text-white shadow-lg">
            <p className="text-sm opacity-80">
              {language === "id" ? "Monitoring AI Pintar" : "Smart AI Monitoring"}
            </p>

            <h1 className="text-4xl font-bold mt-3">
              {t.optimizeEnergy}
            </h1>

            <p className="opacity-80 mt-3 max-w-2xl">
              {t.dashboardDesc}
            </p>

            <button
              onClick={() => navigate("/prediction")}
              className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-md"
            >
              {t.viewAnalytics || (language === "id" ? "Lihat Analitik" : "View Analytics")}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default DashboardPage;