/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import {
  TrendingUp,
  Award,
  Compass,
  Calculator,
  Sparkles,
  Filter,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion } from "motion/react";

export default function AnalyticsPage() {
  const {
    data,
    isLoading,
    language,
    theme,
    selectedCompanyForAnalytics,
    setSelectedCompanyForAnalytics,
  } = useDashboardStore();
  const t = translations[language];

  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "target">(
    "revenue",
  );
  const [growthFactor, setGrowthFactor] = useState<number>(10);
  const [activeQuarter, setActiveQuarter] = useState<string>("All");

  const companyNamesMap = React.useMemo(() => {
    if (!data) return {};
    const corporateSuffix = [
      "Enterprises",
      "& Co.",
      "Logistics",
      "Trading Group",
      "Industries",
      "Creative Labs",
      "Global Solutions",
      "Services Inc.",
      "Holdings",
      "Ventures",
      "Associates",
      "Partners",
    ];
    const mapping: Record<string, string> = {};
    data.recentTransactions.forEach((tx, idx) => {
      const lastName = tx.name.split(" ")[1] || "Group";
      mapping[tx.id] =
        `${lastName} ${corporateSuffix[idx % corporateSuffix.length]}`;
    });
    return mapping;
  }, [data]);

  const rawTrendPoints = React.useMemo(() => {
    if (!data) return [];
    if (!selectedCompanyForAnalytics) return data.revenueTrend;

    const selectedCompany = data.recentTransactions.find(
      (tx) => tx.id === selectedCompanyForAnalytics,
    );
    if (!selectedCompany) return data.revenueTrend;

    return data.revenueTrend.map((point, idx) => {
      const seed = parseInt(selectedCompany.id.replace(/\D/g, "") || "3", 10);
      const wave =
        0.8 + 0.35 * Math.sin((idx + seed) * 0.7) + 0.1 * Math.cos(idx * 1.5);

      const itemRevenue = Math.round(
        (selectedCompany.revenue / data.revenueTrend.length) * wave,
      );
      const itemTarget = Math.round(
        itemRevenue * (1.05 + 0.12 * Math.sin((idx - seed) * 0.5)),
      );
      return {
        month: point.month,
        revenue: itemRevenue,
        target: itemTarget,
      };
    });
  }, [data, selectedCompanyForAnalytics]);

  if (isLoading || !data) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse"
        id="analytics-skeleton"
      >
        <div className="h-96 bg-white/40 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-6"></div>
        <div className="h-96 bg-white/40 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-6"></div>
      </div>
    );
  }

  const projectedData = rawTrendPoints.map((point) => {
    const historicalVal = point[selectedMetric];
    const projectedVal = Math.round(historicalVal * (1 + growthFactor / 100));
    return {
      month: point.month,
      [selectedMetric]: historicalVal,
      [`Projected (${growthFactor}%)`]: projectedVal,
    };
  });

  const totalHistoricRevenue = rawTrendPoints.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const projectedExtraEarnings = Math.round(
    totalHistoricRevenue * (growthFactor / 100),
  );
  const totalForecastedRevenue = totalHistoricRevenue + projectedExtraEarnings;

  const radarData = [
    { subject: "Fashion Engagement", A: 90, B: 75, fullMark: 100 },
    { subject: "Electronics Retention", A: 85, B: 95, fullMark: 100 },
    { subject: "Food Volume Demand", A: 70, B: 60, fullMark: 100 },
    { subject: "Lead Acquisition", A: 80, B: 70, fullMark: 100 },
    { subject: "Brand Awareness", A: 75, B: 85, fullMark: 100 },
  ];

  return (
    <div className="space-y-6" id="analytics-suite-container">
      {/* Dynamic Forecast Hero Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 dark:bg-zinc-900 border border-zinc-850 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        id="analytics-hero-panel"
      >
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-wider text-amber-400 uppercase bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-lg w-max">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {selectedCompanyForAnalytics &&
              companyNamesMap[selectedCompanyForAnalytics]
                ? `${companyNamesMap[selectedCompanyForAnalytics]} AUDIT`
                : "Interactive Projection Center"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans">
            {selectedCompanyForAnalytics &&
            companyNamesMap[selectedCompanyForAnalytics]
              ? `${companyNamesMap[selectedCompanyForAnalytics]} Growth Audit`
              : "Forecast High-Net-Worth Growth Parameters"}
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans text-left">
            {selectedCompanyForAnalytics &&
            companyNamesMap[selectedCompanyForAnalytics]
              ? `Review custom weekly runway expectations, projected growth rates, and contract margin comparisons generated exclusively for ${companyNamesMap[selectedCompanyForAnalytics]}.`
              : "Determine potential weekly return rates by adjusting target multipliers. Review simulations and export models for executive presentations instantly."}
          </p>
        </div>

        {/* Dynamic Widget counter built in negative space */}
        <div
          className="bg-white/10 border border-white/10 backdrop-blur-md px-5 py-4 rounded-2xl flex flex-col justify-center text-right font-sans w-full md:w-auto"
          id="projection-stats-box"
        >
          <span className="text-[10px] font-bold font-mono uppercase text-zinc-400 block">
            With Proposed {growthFactor}% Scale
          </span>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-300 font-mono mt-1">
            ${totalForecastedRevenue.toLocaleString()}
          </span>
          <span className="text-[9px] text-zinc-400 block mt-0.5">
            Increase of +${projectedExtraEarnings.toLocaleString()} margins
          </span>
        </div>
      </motion.div>

      {/* Primary Workspace Controls Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
        id="analytics-grid"
      >
        {/* Forecast Sandbox Chart Card  */}
        <div
          className="col-span-12 lg:col-span-8 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md flex flex-col justify-between"
          id="forecast-sandbox-card"
        >
          <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
            <div>
              <span className="text-[9px] font-extrabold text-zinc-400 font-mono uppercase tracking-wider block">
                Decision Support Center
              </span>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans mt-0.5">
                Earnings Simulation Sandbox
              </h3>
            </div>

            {/* Quick Interactive Tool Options */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* TARGET COMPANY SELECT OPTION */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-950/45 px-2.5 py-1.5 rounded-lg border border-zinc-200/40 dark:border-zinc-850/40 text-[10px] font-mono font-bold text-zinc-500">
                <span className="mr-1">COMPANY:</span>
                <select
                  value={selectedCompanyForAnalytics || ""}
                  onChange={(e) =>
                    setSelectedCompanyForAnalytics(e.target.value || null)
                  }
                  className="bg-transparent border-none p-0 outline-none font-bold text-zinc-800 dark:text-zinc-100 cursor-pointer focus:ring-0 text-[10px]"
                >
                  <option value="" className="dark:bg-zinc-900">
                    GLOBAL AGGREGATE
                  </option>
                  {data.recentTransactions.map((tx) => (
                    <option
                      key={tx.id}
                      value={tx.id}
                      className="dark:bg-zinc-900"
                    >
                      {companyNamesMap[tx.id] || tx.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Metric button selection */}
              <button
                onClick={() =>
                  setSelectedMetric(
                    selectedMetric === "revenue" ? "target" : "revenue",
                  )
                }
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold font-mono uppercase text-zinc-650 dark:text-zinc-350 hover:bg-zinc-150 dark:hover:bg-zinc-850 cursor-pointer"
                title="Toggle simulated base"
              >
                Base:{" "}
                {selectedMetric === "revenue"
                  ? "Total Revenue"
                  : "Total Target"}
              </button>

              {/* Slider Input for local state updates */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950/45 px-2.5 py-1 rounded-lg border border-zinc-200/40 dark:border-zinc-850/40">
                <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-bold font-mono text-zinc-505">
                  Growth:
                </span>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={growthFactor}
                  onChange={(e) =>
                    setGrowthFactor(parseInt(e.target.value, 10))
                  }
                  className="w-16 h-1 rounded bg-zinc-200 dark:bg-zinc-800 appearance-none cursor-pointer accent-indigo-505"
                />
                <span className="text-[10px] font-mono font-bold text-indigo-505 w-8 text-right">
                  +{growthFactor}%
                </span>
              </div>
            </div>
          </div>

          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projectedData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorHistorical"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={
                        selectedMetric === "revenue" ? "#6366f1" : "#f3c623"
                      }
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        selectedMetric === "revenue" ? "#6366f1" : "#f3c623"
                      }
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorProjected"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "light" ? "#e4e4e7/50" : "#27272a/40"}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "#71717a",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  tick={{
                    fontSize: 9,
                    fill: "#71717a",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-xl shadow-lg font-sans text-xs">
                          <p className="font-bold text-zinc-500 font-mono text-[9px] uppercase tracking-wider mb-1">
                            {payload[0].payload.month} performance
                          </p>
                          <p className="text-zinc-650 dark:text-zinc-300">
                            Base:{" "}
                            <span className="font-bold font-mono text-indigo-505 dark:text-indigo-400">
                              ${payload[0].value?.toLocaleString()}
                            </span>
                          </p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            Projected:{" "}
                            <span className="font-bold font-mono">
                              ${payload[1]?.value?.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: 10,
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetric === "revenue" ? "#6366f1" : "#f3c623"}
                  fillOpacity={1}
                  fill="url(#colorHistorical)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey={`Projected (${growthFactor}%)`}
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorProjected)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Quality Metrics Radar Card */}
        <div
          className="col-span-12 lg:col-span-4 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md flex flex-col justify-between"
          id="market-quality-radar-card"
        >
          <div>
            <span className="text-[9px] font-extrabold text-zinc-400 font-mono uppercase tracking-wider block">
              Market Distribution
            </span>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans mt-0.5">
              Retention & Velocity Audit
            </h3>
          </div>

          <div className="h-60 flex items-center justify-center my-3">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid
                  stroke={theme === "light" ? "#e4e4e7/70" : "#27272a/60"}
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontSize: 9,
                    fill: "#71717a",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                  }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fill: "#71717a" }}
                />
                {/* Mode values comparison */}
                <Radar
                  name="Target Retention"
                  dataKey="B"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Current Retention"
                  dataKey="A"
                  stroke="#f3c623"
                  fill="#f3c623"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar brief description */}
          <div className="text-[10px] text-zinc-400 font-mono text-center leading-relaxed">
            Comparing **Target Velocity** index against actual **Current
            Engagement** metrics. Electronics lead performance parameters by
            +15%.
          </div>
        </div>
      </div>

      {/* Bottom Dynamic scenario auditing card */}
      <div
        className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm backdrop-blur-md"
        id="scenario-auditing-panel"
      >
        <h4 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider mb-3">
          Proposed Actionable Milestones
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Fashion Inventory Scale-up",
              speed: "Immediate Action",
              desc: "Secure high-demand fabric stocks in North America to catch the +24% custom trend vector.",
              icon: Award,
              color: "text-amber-500 bg-amber-500/10",
            },
            {
              title: "Electronic Clearance Sales",
              speed: "Post-Milestone 2",
              desc: "Accelerate the turnover of low-velocity stocks using localized promotion cycles.",
              icon: Compass,
              color: "text-indigo-500 bg-indigo-500/10",
            },
            {
              title: "Food Logistics Optimizations",
              speed: "Next Fiscal Week",
              desc: "Coordinate regional supply flows with New York hubs to cut down warehousing costs.",
              icon: TrendingUp,
              color: "text-emerald-500 bg-emerald-500/10",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-3.5 bg-zinc-50/45 dark:bg-zinc-950/20 rounded-2xl border border-zinc-200/50 dark:border-zinc-850/40 flex items-start gap-3 hover:scale-[1.01] transition-transform"
              >
                <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="font-extrabold text-zinc-800 dark:text-zinc-200">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                  <span className="inline-block text-[9px] font-bold font-mono text-indigo-505 dark:text-indigo-405">
                    {item.speed}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
