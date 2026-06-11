/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Sun,
  Moon,
  Globe,
  Calendar,
  Sliders,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Database,
  Building,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import React from "react";
import TeyzixLogo from "./TeyzixLogo";

export default function HeaderSection() {
  const {
    theme,
    language,
    toggleTheme,
    setLanguage,
    selectedRegion,
    setSelectedRegion,
    isSimulatedEmpty,
    setSimulatedEmpty,
    isSimulatedError,
    setSimulatedError,
    simulatedDelay,
    setSimulatedDelay,
    fetchData,
    isLoading,
    activeTab,
    setActiveTab,
    data,
    setSelectedCompanyInfoId,
  } = useDashboardStore();

  const t = translations[language];

  const companyList = React.useMemo(() => {
    if (!data) return [];
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
    return data.recentTransactions.map((tx, idx) => {
      const lastName = tx.name.split(" ")[1] || "Group";
      return {
        id: tx.id,
        companyName: `${lastName} ${corporateSuffix[idx % corporateSuffix.length]}`,
        repName: tx.name,
      };
    });
  }, [data]);

  const regions: (
    | "All"
    | "North America"
    | "Europe"
    | "Asia Pacific"
    | "Middle East"
    | "South America"
  )[] = [
    "All",
    "North America",
    "Europe",
    "Asia Pacific",
    "Middle East",
    "South America",
  ];

  return (
    <header
      className="flex flex-col gap-6 pb-6 border-b border-zinc-200/50 dark:border-zinc-800/40"
      id="main-header"
    >
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <TeyzixLogo className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-sans capitalize">
              {activeTab === "overview" ? t.dashboardTitle : activeTab}
            </h1>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              {t.subTitle} (Standard UTC: 2026-06-11)
            </p>
          </div>
        </div>

        <div className="flex md:hidden items-center bg-zinc-100/90 dark:bg-zinc-900/60 p-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/30 shadow-inner order-last md:order-none w-full md:w-auto overflow-x-auto">
          {(
            [
              "overview",
              "analytics",
              "companies",
              "accounts",
              "help",
              "profile",
            ] as const
          ).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all capitalize flex-1 md:flex-none whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-extrabold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
                id={`header-tab-${tab}`}
              >
                {tab === "overview" ? t.dashboardTitle : tab}
              </button>
            );
          })}
        </div>

        {/* Global Controls - Lang, Theme and Simulator trigger */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className={`p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all ${
              isLoading ? "animate-spin text-indigo-500" : ""
            }`}
            title="Force warehouse query refresh"
            id="refresh-connector-btn"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              id="language-dropdown-trigger"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span className="uppercase">{language}</span>
            </button>
            <div
              className="absolute right-0 top-full mt-1.5 w-32 hidden group-hover:flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl shadow-xl z-50 overflow-hidden transform duration-200"
              id="language-list"
            >
              {(["en", "de", "fr", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-2 text-xs text-left cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                    language === lang
                      ? "font-bold text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {lang === "en" && "🇺🇸 English"}
                  {lang === "de" && "🇩🇪 Deutsch"}
                  {lang === "fr" && "🇫🇷 Français"}
                  {lang === "es" && "🇪🇸 Español"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-805 transition-colors cursor-pointer"
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
            id="theme-toggle-btn"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-1 bg-white/40 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-800/30 p-2.5 rounded-2xl backdrop-blur-sm shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
              {t.filterLocation}:
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="text-xs font-semibold bg-transparent border-0 text-zinc-850 dark:text-zinc-100 focus:ring-0 cursor-pointer hover:text-indigo-500 transition-colors py-1"
              id="region-filter-select"
            >
              <option value="All" className="dark:bg-zinc-950">
                {t.allRegions}
              </option>
              {regions
                .filter((r) => r !== "All")
                .map((reg) => (
                  <option key={reg} value={reg} className="dark:bg-zinc-950">
                    {reg}
                  </option>
                ))}
            </select>
          </div>

          {companyList.length > 0 && (
            <div className="flex items-center gap-2 border-l border-zinc-200/50 dark:border-zinc-800/40 pl-4">
              <Building className="w-4 h-4 text-indigo-500" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
                Portfolio Companies:
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedCompanyInfoId(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
                className="text-xs font-semibold bg-transparent border-0 text-zinc-850 dark:text-zinc-100 focus:ring-0 cursor-pointer hover:text-indigo-500 transition-colors py-1 max-w-[160px] md:max-w-xs"
                id="header-company-inspect-select"
              >
                <option value="" disabled className="dark:bg-zinc-950">
                  Select Corporate Entity...
                </option>
                {companyList.map((comp) => (
                  <option
                    key={comp.id}
                    value={comp.id}
                    className="dark:bg-zinc-950"
                  >
                    {comp.companyName} ({comp.repName})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-mono mt-0.5">2026-06-11 UTC</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap bg-zinc-100/60 dark:bg-zinc-950/50 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
          <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-bold hidden xl:inline-block">
            {t.simulationPanel}:
          </span>

          <button
            onClick={() => setSimulatedError(!isSimulatedError)}
            className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all ${
              isSimulatedError
                ? "bg-rose-500 text-white animate-pulse"
                : "text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            }`}
            title="Click to simulate corporate warehouse connection loss (database 500 error)"
            id="simulation-toggle-error"
          >
            {isSimulatedError ? "🔴 ERROR: ACTIVE" : "🔌 SIM ERROR"}
          </button>

          <button
            onClick={() => setSimulatedEmpty(!isSimulatedEmpty)}
            className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all ${
              isSimulatedEmpty
                ? "bg-amber-500 text-white"
                : "text-zinc-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
            }`}
            title="Click to trigger simulated empty dataset"
            id="simulation-toggle-empty"
          >
            {isSimulatedEmpty ? "🟡 EMPTY: ACTIVE" : "📦 SIM EMPTY"}
          </button>

          <div className="flex items-center text-[10px] text-zinc-400 gap-1 font-mono">
            <span>PING:</span>
            <select
              value={simulatedDelay}
              onChange={(e) => setSimulatedDelay(parseInt(e.target.value, 10))}
              className="text-[10px] bg-transparent border-0 p-0 text-zinc-650 dark:text-zinc-300 focus:ring-0 cursor-pointer font-bold"
              id="simulation-delay-select"
            >
              <option value="100" className="dark:bg-zinc-950">
                100ms (LAN)
              </option>
              <option value="400" className="dark:bg-zinc-950">
                400ms (Broadband)
              </option>
              <option value="1500" className="dark:bg-zinc-950">
                1500ms (Slow 3G)
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
