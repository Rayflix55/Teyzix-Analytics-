/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";

const ChartSkeleton = ({ title }: { title: string }) => (
  <div className="bg-white/60 dark:bg-zinc-900/35 border border-zinc-200/50 dark:border-zinc-800/40 p-5 rounded-3xl animate-pulse min-h-[280px] flex flex-col justify-between">
    <div className="flex justify-between">
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
      <div className="w-6 h-6 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
    </div>
    <div className="flex-1 flex items-center justify-center my-4">
      <div className="h-16 w-16 rounded-full border-4 border-zinc-200/55 dark:border-zinc-800/55 border-t-indigo-505 animate-spin"></div>
    </div>
    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
  </div>
);

export function SalesTrackingTrendCard() {
  const { data, isLoading, language, theme } = useDashboardStore();
  const t = translations[language];

  if (isLoading || !data) return <ChartSkeleton title={t.trackingOurSales} />;

  const formatYAxis = (value: number): string => {
    return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md"
      id="sales-tracking-trend-card"
    >
      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-wider uppercase block">
            {t.weeklyAnalytics}
          </span>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
            {t.trackingOurSales}
          </h3>
        </div>

        {/* Legend block designed exactly like the attachment */}
        <div className="flex items-center gap-4 text-[10px] font-bold font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-505"></span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {t.totalRevenue}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f3c623]"></span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {t.totalTarget}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.revenueTrend}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
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
              tickFormatter={formatYAxis}
              tick={{
                fontSize: 9,
                fill: "#71717a",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            />
            {/* Design-accurate high contrast tooltip popup */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-zinc-90 w bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-lg backdrop-blur-md">
                      <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1 font-mono uppercase tracking-wider">
                        {payload[0].payload.month} performance
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Revenue:
                          </span>
                          <span className="font-bold text-indigo-550 dark:text-indigo-400 font-mono">
                            ${payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-500 dark:text-zinc-400">
                            Target:
                          </span>
                          <span className="font-bold text-[#f3c623] font-mono">
                            ${payload[1]?.value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#6366f1" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#f3c623"
              strokeWidth={2}
              dot={{ r: 2, fill: "#ffffff", stroke: "#f3c623" }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function MarketDemandCard() {
  const { data, isLoading, language } = useDashboardStore();
  const t = translations[language];

  if (isLoading || !data) return <ChartSkeleton title={t.marketDemand} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md flex flex-col justify-between h-full"
      id="market-demand-card"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-wider uppercase block">
              {t.marketAnalytics}
            </span>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
              {t.marketDemand}
            </h3>
          </div>
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center text-zinc-550 dark:text-zinc-350">
            <Compass className="w-4 h-4" />
          </div>
        </div>

        {/* Total volume demand figure exactly like 3.048 in design */}
        <div className="my-3 text-right">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-sans">
            3,048
          </span>
          <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">
            Overall volume items
          </span>
        </div>
      </div>

      {/* Progress Bars containing design colors */}
      <div className="space-y-4 my-2 flex-1 flex flex-col justify-center">
        {data.categoryDistribution.map((cat, idx) => {
          return (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex justify-between text-xs font-sans font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">
                  {cat.category}
                </span>
                <span className="font-mono text-zinc-900 dark:text-white">
                  {cat.percentage}%
                </span>
              </div>

              {/* Custom styled soft-blend progress bar element */}
              <div className="w-full h-3 bg-zinc-150 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                    boxShadow: `0 0 6px ${cat.color}60`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                <span>Value share</span>
                <span>${cat.revenue.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function CustomerGrowthCard() {
  const { data, isLoading, language } = useDashboardStore();
  const t = translations[language];

  if (isLoading || !data) return <ChartSkeleton title={t.customersHead} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md flex flex-col justify-between h-full"
      id="customer-growth-card"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-wider uppercase block">
            {t.weeklyAnalytics}
          </span>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
            {t.customersHead}
          </h3>
        </div>
        <div className="w-7 h-7 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg flex items-center justify-center text-zinc-550 dark:text-zinc-400">
          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
        </div>
      </div>

      {/* Geolocation listing metrics */}
      <div className="space-y-3.5 my-3 flex-grow flex flex-col justify-center">
        {data.customerGrowth.map((loc) => (
          <div
            key={loc.location}
            className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850/30 pb-2"
          >
            <div className="flex items-center gap-2">
              {/* Little dot with corresponding color */}
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: loc.color }}
              />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 font-sans">
                {loc.location}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                {loc.value.toLocaleString()}
              </span>
              <span className="text-[9px] uppercase font-mono text-zinc-400 block font-bold">
                +{loc.percentage}% growth
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SalesComparisonRangeCard() {
  const { data, isLoading, language, theme } = useDashboardStore();
  const t = translations[language];

  if (isLoading || !data) return <ChartSkeleton title={t.areaMarketDemand} />;

  const plotData = data.salesComparison.map((point) => ({
    region: point.region,
    floatingRange: [point.min, point.max], // Coordinates floating points
    average: point.average,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md"
      id="sales-comparison-range-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-wider uppercase block">
            {t.marketAnalytics}
          </span>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
            {t.areaMarketDemand}
          </h3>
        </div>
      </div>

      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={plotData}
            margin={{ top: 5, right: 10, left: -30, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme === "light" ? "#e4e4e7/50" : "#27272a/40"}
            />
            <XAxis
              dataKey="region"
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
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
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
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 p-2 text-xs rounded-xl shadow-md font-sans">
                      <p className="font-bold text-zinc-800 dark:text-white mb-1 font-mono uppercase tracking-wider text-[10px]">
                        Region: {item.region}
                      </p>
                      <p className="text-indigo-505 font-mono">
                        Max: ${item.floatingRange[1]}
                      </p>
                      <p className="text-[#f3c623] font-mono">
                        Avg: ${item.average}
                      </p>
                      <p className="text-rose-505 font-mono">
                        Min: ${item.floatingRange[0]}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* The Floating Candlestick interval*/}
            <Bar dataKey="floatingRange" fill="#6366f1" radius={6} barSize={10}>
              {plotData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.region === "NY" ? "#a855f7" : "#6366f1"}
                  style={{
                    filter: "drop-shadow(0px 2px 4px rgba(99,102,241,0.35))",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function WeeklyTotalRevenueCard() {
  const { data, isLoading, language, theme } = useDashboardStore();
  const t = translations[language];

  if (isLoading || !data) return <ChartSkeleton title={t.totalRevenue} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-md"
      id="weekly-total-revenue-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono tracking-wider uppercase block">
            {t.weeklyAnalytics}
          </span>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
            {t.totalRevenue}
          </h3>
        </div>

        {/* Mini Highlight tag shown in design */}
        <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono uppercase bg-amber-100/60 dark:bg-amber-950/20 text-amber-600 px-2 py-1 rounded-lg">
          <Sparkles className="w-3 h-3" />
          <span>Wednesday Peak</span>
        </div>
      </div>

      <div className="h-44 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.weeklyRevenue}
            margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme === "light" ? "#e4e4e7/50" : "#27272a/40"}
            />
            <XAxis
              dataKey="day"
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
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
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
                    <div className="bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-md font-sans text-xs">
                      <p className="font-bold text-zinc-900 dark:text-white font-mono uppercase text-[9px] mb-1">
                        Weekday: {payload[0].payload.day}
                      </p>
                      <p className="text-[#f3c623] font-semibold">
                        Revenue: ${payload[0].value}
                      </p>
                      <p className="text-[#6366f1] font-semibold">
                        Target: ${payload[1].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Double columns grouped side-by-side matching colors of design image */}
            <Bar
              dataKey="revenue"
              fill="#f3c623"
              radius={[4, 4, 0, 0]}
              barSize={6}
            />
            <Bar
              dataKey="target"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              barSize={6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
