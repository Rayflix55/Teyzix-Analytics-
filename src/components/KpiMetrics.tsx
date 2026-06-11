/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  DollarSign,
  ShieldAlert,
  ShoppingBag,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import { motion } from "motion/react";

function Sparkline({
  data,
  isUp,
  id,
}: {
  data: number[];
  isUp: boolean;
  id: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height + 2;
      return `${x},${y}`;
    })
    .join(" ");

  const strokeColor = isUp ? "#10b981" : "#f43f5e";

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      aria-label="KPI Trend Sparkline"
    >
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#gradient-${id})`}
      />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KpiMetrics() {
  const { data, isLoading, language, setActiveTab } = useDashboardStore();
  const t = translations[language];

  // Map string icon names to Lucide icons
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "DollarSign":
        return DollarSign;
      case "Activity":
        return Activity;
      case "ShoppingBag":
        return ShoppingBag;
      case "Zap":
        return Zap;
      default:
        return Activity;
    }
  };

  const getSparklineData = (cardId: string) => {
    switch (cardId) {
      case "revenue":
        return [12, 19, 14, 25, 21, 32, 28, 45];
      case "assessment":
        return [45, 42, 58, 62, 55, 69, 74, 82];
      case "orders":
        return [28, 35, 30, 48, 41, 55, 52, 60];
      case "connection":
        return [96, 98, 98, 99, 97, 100, 99, 100];
      default:
        return [10, 15, 8, 20, 12, 25, 18, 30];
    }
  };

  if (isLoading || !data) {
    return (
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        id="kpi-metrics-skeleton"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#fafafa]/40 dark:bg-zinc-900/25 border border-zinc-200/50 dark:border-zinc-850/40 p-5 rounded-2xl h-28 animate-pulse flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              <div className="w-8 h-8 rounded-xl bg-zinc-250 dark:bg-zinc-800"></div>
            </div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { ...data.kpis.revenue, label: t.earningsDay, keyId: "revenue" },
    { ...data.kpis.assessment, label: t.assessment, keyId: "assessment" },
    { ...data.kpis.orders, label: t.orders, keyId: "orders" },
    { ...data.kpis.connection, label: t.connection, keyId: "connection" },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      id="kpi-metrics-row"
    >
      {cards.map((card, idx) => {
        const Icon = getIconComponent(card.icon);
        const isUp = card.trend === "up";
        const isDown = card.trend === "down";

        const targetTab = idx === 0 || idx === 2 ? "accounts" : "analytics";
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            onClick={() => setActiveTab(targetTab)}
            className="group relative overflow-hidden bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl backdrop-blur-md shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer hover:scale-[1.01]"
            id={`kpi-card-${card.id}`}
            title={`Click to open ${targetTab} deep-dive view`}
          >
            {/* Soft decorative background highlight blur */}
            <span className="absolute -right-5 -bottom-5 w-16 h-16 rounded-full bg-indigo-500/5 dark:bg-indigo-450/5 group-hover:scale-150 transition-transform duration-500 blur-sm"></span>

            <div className="flex justify-between items-start">
              {/* Card Label */}
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold font-sans">
                {card.label}
              </span>

              {/* Icon Capsule */}
              <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Middle Row: Numbers & Subcounts */}
            <div className="mt-3 flex items-baseline justify-between gap-1">
              <div>
                <h2 className="text-xl md:text-2xl font-bold font-sans text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </h2>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 block">
                  {card.countLabel}
                </span>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="pb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Sparkline
                  data={getSparklineData(card.keyId)}
                  isUp={isUp || card.trend === "neutral"}
                  id={card.keyId}
                />
              </div>
            </div>

            {/* Performance direction subtext badges */}
            <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-850/60 pt-2">
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono font-bold uppercase tracking-wider">
                Trend Rate:
              </span>

              {isUp && (
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ArrowUpRight className="w-3 h-3 stroke-[3] mr-0.5" />
                  {card.subValue}
                </span>
              )}
              {isDown && (
                <span className="inline-flex items-center text-[10px] font-bold text-rose-600 dark:text-rose-400 font-mono bg-rose-500/10 dark:bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <ArrowDownRight className="w-3 h-3 stroke-[3] mr-0.5" />
                  {card.subValue}
                </span>
              )}
              {!isUp && !isDown && (
                <span className="inline-flex items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-500/10 dark:bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {card.subValue}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
