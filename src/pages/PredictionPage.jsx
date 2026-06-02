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

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import translations from "../translatations/translations";

import { useLanguage } from "../context/LanguageContext";

function PredictionPage() {
  const navigate =
    useNavigate();

  const { language } =
    useLanguage();

  const t =
    translations[language];

  const [prediction, setPrediction] =
    useState({
      totalUsage: 0,
      estimatedBill: 0,
      percentage: 0,
    });

  const [lineData, setLineData] =
    useState([]);

  const [recommendations, setRecommendations] =
    useState([]);

  const [insights, setInsights] =
    useState([]);

  useEffect(() => {
    const savedData =
      JSON.parse(
        localStorage.getItem(
          "prediction-data"
        )
      );

    if (!savedData) return;

    const ac =
      Number(savedData.ac || 0);

    const tv =
      Number(savedData.tv || 0);

    const refrigerator =
      Number(
        savedData.refrigerator || 0
      );

    const lighting =
      Number(
        savedData.lighting || 0
      );

    const washing =
      Number(
        savedData.washingMachine || 0
      );

    /* ELECTRICITY CALCULATION */
    const totalUsage =
      ac * 1.5 +
      tv * 0.2 +
      refrigerator * 0.15 +
      lighting * 0.1 +
      washing * 0.5;

    const monthlyUsage =
      totalUsage * 30;

    const estimatedBill =
      monthlyUsage * 1444;

    const percentage =
      Math.floor(
        Math.random() * 20
      ) + 5;

    setPrediction({
      totalUsage:
        monthlyUsage.toFixed(0),

      estimatedBill:
        estimatedBill.toFixed(0),

      percentage,
    });

    /* CHART */
    setLineData([
      {
        month: "Jan",
        usage:
          monthlyUsage * 0.8,
      },

      {
        month: "Feb",
        usage:
          monthlyUsage * 0.9,
      },

      {
        month: "Mar",
        usage:
          monthlyUsage * 0.85,
      },

      {
        month: "Apr",
        usage:
          monthlyUsage * 1,
      },

      {
        month: "May",
        usage:
          monthlyUsage * 0.95,
      },

      {
        month: "Jun",
        usage:
          monthlyUsage * 1.1,
      },
    ]);

    /* DYNAMIC INSIGHT */
    const aiInsights = [];

    if (ac > 8) {
      aiInsights.push(
        t.acHighUsage
      );
    }

    if (lighting > 10) {
      aiInsights.push(
        t.lightingHighUsage
      );
    }

    if (tv > 6) {
      aiInsights.push(
        t.tvHighUsage
      );
    }

    if (
      aiInsights.length === 0
    ) {
      aiInsights.push(
        t.efficientUsage
      );
    }

    setInsights(aiInsights);

    /* RECOMMENDATION */
    const savingTips = [];

    if (ac > 6) {
      savingTips.push({
        title:
          t.reduceAcUsage,
        save:
          t.save75,
      });
    }

    if (lighting > 8) {
      savingTips.push({
        title:
          t.switchLed,
        save:
          t.save40,
      });
    }

    if (tv > 5) {
      savingTips.push({
        title:
          t.limitTv,
        save:
          t.save20,
      });
    }

    savingTips.push({
      title:
        t.unplugDevices,
      save:
        t.save30,
    });

    setRecommendations(
      savingTips
    );

    /* SAVE HISTORY */
    const oldHistory =
      JSON.parse(
        localStorage.getItem(
          "prediction-history"
        )
      ) || [];

    const newHistory = {
      id: Date.now(),

      month:
        new Date().toLocaleString(
          language === "id"
            ? "id-ID"
            : "en-US",
          {
            month: "long",
            year: "numeric",
          }
        ),

      usage:
        monthlyUsage.toFixed(
          0
        ) + " kWh",

      bill:
        "Rp " +
        Number(
          estimatedBill
        ).toLocaleString(
          "id-ID"
        ),

      status:
        monthlyUsage > 400
          ? language === "id"
            ? "Tinggi"
            : "High"
          : monthlyUsage > 250
          ? language === "id"
            ? "Normal"
            : "Normal"
          : language === "id"
          ? "Efisien"
          : "Efficient",
    };

    localStorage.setItem(
      "prediction-history",
      JSON.stringify([
        newHistory,
        ...oldHistory,
      ])
    );
  }, [language, t]);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a]">

      <Sidebar />

      <main className="flex-1">

        {/* HEADER */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold dark:text-white">
              {t.predictionResult}
            </h1>

            <p className="text-gray-400 mt-2">
              {t.energyOverview}
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
                  John Doe
                </h2>

                <p className="text-gray-400 text-sm">
                  {t.premiumUser}
                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                <User size={22} />
              </div>

            </div>

          </div>

        </div>

        <div className="p-8">

          {/* HERO */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[30px] p-10 shadow-xl text-white">

            <div className="flex items-center gap-3">

              <CheckCircle2
                size={24}
              />

              <p className="text-xl">
                {t.predictionComplete}
              </p>

            </div>

            <h1 className="text-7xl font-bold mt-5">
              Rp{" "}
              {Number(
                prediction.estimatedBill
              ).toLocaleString(
                "id-ID"
              )}
            </h1>

            <p className="text-blue-100 text-2xl mt-3">
              {t.estimatedNextBill}
            </p>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

              <HeroCard
                icon={
                  <Zap size={22} />
                }
                title={
                  t.predictedUsage
                }
                value={`${prediction.totalUsage} kWh`}
              />

              <HeroCard
                icon={
                  <TrendingUp size={22} />
                }
                title={
                  t.vsLastMonth
                }
                value={`+${prediction.percentage}%`}
              />

              <HeroCard
                icon={
                  <Calendar size={22} />
                }
                title={
                  t.forecastPeriod
                }
                value="May 2026"
              />

            </div>

            {/* BUTTON */}
            <div className="flex gap-5 mt-8 flex-wrap">

              <button className="bg-white text-blue-600 px-7 py-4 rounded-2xl font-semibold flex items-center gap-3">

                <Download size={20} />

                {t.downloadReport}

              </button>

              <button className="bg-blue-400/30 px-7 py-4 rounded-2xl font-semibold flex items-center gap-3">

                <Share2 size={20} />

                {t.share}

              </button>

            </div>

          </div>

          {/* CHART */}
          <div className="bg-white dark:bg-slate-900 rounded-[30px] p-8 shadow-lg mt-8">

            <h2 className="text-4xl font-bold dark:text-white">
              {t.currentVsPredicted}
            </h2>

            <p className="text-gray-400 mt-2">
              {t.sixMonthComparison}
            </p>

            <div className="h-[420px] mt-10">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={lineData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#2563eb"
                    strokeWidth={5}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* INSIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

            {/* AI */}
            <div className="bg-[#f4ebff] dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-[30px] p-8">

              <div className="flex items-center gap-5">

                <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center">

                  <TrendingUp size={30} />

                </div>

                <h2 className="text-4xl font-bold dark:text-white">
                  {t.aiInsights}
                </h2>

              </div>

              <ul className="space-y-5 mt-8">

                {insights.map(
                  (
                    insight,
                    index
                  ) => (
                    <InsightItem
                      key={index}
                      text={
                        insight
                      }
                    />
                  )
                )}

              </ul>

            </div>

            {/* RECOMMENDATION */}
            <div className="bg-[#ecfdf3] dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[30px] p-8">

              <div className="flex items-center gap-5">

                <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center">

                  <Lightbulb size={30} />

                </div>

                <h2 className="text-4xl font-bold dark:text-white">
                  {t.savingRecommendations}
                </h2>

              </div>

              <div className="space-y-6 mt-8">

                {recommendations.map(
                  (
                    item,
                    index
                  ) => (
                    <SavingItem
                      key={index}
                      title={
                        item.title
                      }
                      save={
                        item.save
                      }
                    />
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

function HeroCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white/10 rounded-[24px] p-6">

      <div className="flex items-center gap-3 text-blue-100">
        {icon}

        <p>{title}</p>
      </div>

      <h2 className="text-5xl font-bold mt-5">
        {value}
      </h2>

    </div>
  );
}

function InsightItem({
  text,
}) {
  return (
    <div className="flex gap-4">

      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-3"></div>

      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {text}
      </p>

    </div>
  );
}

function SavingItem({
  title,
  save,
}) {
  return (
    <div className="flex gap-4">

      <CheckCircle2
        className="text-green-600 mt-1"
        size={24}
      />

      <div>

        <h2 className="font-semibold text-lg dark:text-white">
          {title}
        </h2>

        <p className="text-gray-400 mt-1">
          {save}
        </p>

      </div>

    </div>
  );
}

export default PredictionPage;