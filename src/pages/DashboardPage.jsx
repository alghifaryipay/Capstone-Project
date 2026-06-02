import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import Header from "../components/layout/Header";

import UsageChart from "../components/dashboard/UsageChart";
import InsightCard from "../components/dashboard/InsightCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import WarningCard from "../components/dashboard/WarningCard";
import NotificationCard from "../components/dashboard/NotificationCard";
import Button from "../components/ui/Button";
import translations from "../translatations/translations";

import { useLanguage } from "../context/LanguageContext";

function DashboardPage() {

  const { language } =
    useLanguage();

  // fallback supaya tidak undefined
  const t =
    translations[language] ||
    translations.en;

  return (
    <div className="flex bg-[#f7f9fc] dark:bg-[#0f172a] min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-8">

        {/* MOBILE */}
        <MobileSidebar />

        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <div className="space-y-6 mt-6">

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <InsightCard
              title={t.totalUsage}
              value="350 kWh"
              increase="+12%"
            />

            <InsightCard
              title={t.estimatedBill}
              value="Rp 480K"
              increase="+8%"
            />

            <InsightCard
              title={t.efficiency}
              value="86%"
              increase="+4%"
            />

            <InsightCard
              title={t.carbonImpact}
              value="120kg"
              increase="-2%"
            />

          </div>

          {/* CHART */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2">
              <UsageChart />
            </div>

            <RecommendationCard />

          </div>

          {/* WARNING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <WarningCard />

            <NotificationCard />

          </div>

          {/* BANNER */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[32px] p-8 text-white shadow-lg">

            <p className="text-sm opacity-80">

              {language === "id"
                ? "Monitoring AI Pintar"
                : "Smart AI Monitoring"}

            </p>

            <h1 className="text-4xl font-bold mt-3">
              {t.optimizeEnergy}
            </h1>

            <p className="opacity-80 mt-3 max-w-2xl">
              {t.dashboardDesc}
            </p>

            <Button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-all">

              {t.viewAnalytics}

            </Button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default DashboardPage;