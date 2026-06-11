/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import SidebarNavigation from "./components/SidebarNavigation";
import HeaderSection from "./components/HeaderSection";
import KpiMetrics from "./components/KpiMetrics";
import CopilotWidget from "./components/CopilotWidget";
import {
  SalesTrackingTrendCard,
  MarketDemandCard,
  CustomerGrowthCard,
  SalesComparisonRangeCard,
  WeeklyTotalRevenueCard,
} from "./components/DashboardCharts";
import CustomerTable from "./components/CustomerTable";
import AnalyticsPage from "./components/AnalyticsPage";
import CompaniesPage from "./components/CompaniesPage";
import AccountsPage from "./components/AccountsPage";
import HelpPage from "./components/HelpPage";
import ProfilePage from "./components/ProfilePage";
import CompanyInfoModal from "./components/CompanyInfoModal";
import SplashScreen from "./components/SplashScreen";
import { useDashboardStore } from "./store/useDashboardStore";
import { translations } from "./utils/translations";
import {
  ShieldAlert,
  RefreshCw,
  Layers,
  FileText,
  X,
  ExternalLink,
  Download,
  Printer,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const {
    theme,
    language,
    error,
    isLoading,
    data,
    fetchData,
    setSimulatedError,
    resetFilters,
    activeTab,
    selectedCompanyInfoId,
    setSelectedCompanyInfoId,
  } = useDashboardStore();

  const t = translations[language];
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const downloadHTMLReport = () => {
    if (!data) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Teyzix Analytics Executive Report - ${new Date().toISOString().substring(0, 10)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
    @media print {
      body {
        background-color: #ffffff;
        color: #000000;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 p-8 min-h-screen">
  <div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
    <!-- Report Header -->
    <div class="flex justify-between items-start border-b border-slate-200 pb-6 mb-8">
      <div>
        <span class="text-[10px] font-bold tracking-wider text-indigo-600 uppercase mono">Intelligence Output</span>
        <h1 class="text-2xl font-extrabold text-slate-900 mt-1">Teyzix Analytics Executive Suite</h1>
        <p class="text-sm text-slate-500 mt-1">Executive Performance & Operations Audit</p>
      </div>
      <div class="text-right">
        <span class="text-xs font-bold mono bg-slate-100 py-1 px-2.5 rounded-lg text-slate-600">CONFIDENTIAL</span>
        <p class="text-xs text-slate-400 mono mt-2">Export Date: ${new Date().toISOString().substring(0, 10)}</p>
        <p class="text-xs text-slate-400 mono">Node Ref: Teyzi-core-X</p>
      </div>
    </div>

    <!-- KPI Summary Cards Grid -->
    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mono mb-4">I. Key Business Indicators (KPI)</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
        <span class="text-[10px] font-semibold text-slate-500 block">Total Revenue</span>
        <span class="text-lg font-bold text-slate-900 mono mt-1 inline-block">${data.kpis.revenue.value}</span>
        <span class="text-[9px] text-slate-400 block mt-0.5">${data.kpis.revenue.subValue} trend</span>
      </div>
      <div class="border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
        <span class="text-[10px] font-semibold text-slate-500 block">Assessment</span>
        <span class="text-lg font-bold text-slate-900 mono mt-1 inline-block">${data.kpis.assessment.value}</span>
        <span class="text-[9px] text-slate-400 block mt-0.5">${data.kpis.assessment.subValue} trend</span>
      </div>
      <div class="border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
        <span class="text-[10px] font-semibold text-slate-500 block">Purchase Orders</span>
        <span class="text-lg font-bold text-slate-900 mono mt-1 inline-block">${data.kpis.orders.value}</span>
        <span class="text-[9px] text-slate-400 block mt-0.5">${data.kpis.orders.subValue} count</span>
      </div>
      <div class="border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
        <span class="text-[10px] font-semibold text-slate-500 block">System Connection</span>
        <span class="text-lg font-bold text-slate-900 mono mt-1 inline-block">${data.kpis.connection.value}</span>
        <span class="text-[9px] text-slate-400 block mt-0.5">${data.kpis.connection.subValue} ping delay</span>
      </div>
    </div>

    <!-- Revenue Trend Table -->
    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mono mb-4">II. Revenue Trend Timeline</h2>
    <div class="overflow-x-auto mb-8">
      <table class="w-full border-collapse border border-slate-200 text-xs">
        <thead>
          <tr class="bg-slate-100 mono text-left text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <th class="border border-slate-200 py-2 px-3">Month</th>
            <th class="border border-slate-200 py-2 px-3">Revenue ($)</th>
            <th class="border border-slate-200 py-2 px-3">Target ($)</th>
            <th class="border border-slate-200 py-2 px-3">Performance Margin</th>
          </tr>
        </thead>
        <tbody>
          ${data.revenueTrend
            .map((point) => {
              const diff = point.revenue - point.target;
              const percentage = ((diff / point.target) * 100).toFixed(1);
              const sign = diff >= 0 ? "+" : "";
              const color =
                diff >= 0
                  ? "text-emerald-700 font-semibold"
                  : "text-rose-700 font-semibold";
              return `
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="border border-slate-200 py-2 px-3 font-semibold">${point.month}</td>
                <td class="border border-slate-200 py-2 px-3 font-bold mono">$${point.revenue.toLocaleString()}</td>
                <td class="border border-slate-200 py-2 px-3 text-slate-500 mono">$${point.target.toLocaleString()}</td>
                <td class="border border-slate-200 py-2 px-3 ${color} mono">${sign}${percentage}%</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Product Category Breakdown -->
    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mono mb-4">III. Market Demand & Share</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Categories list -->
      <div class="border border-slate-200 p-4 rounded-2xl">
        <h3 class="text-xs font-bold text-slate-700 uppercase mono mb-3">Product Segments</h3>
        <div class="space-y-3">
          ${data.categoryDistribution
            .map(
              (cat) => `
            <div>
              <div class="flex justify-between font-semibold text-xs mb-1">
                <span>${cat.category}</span>
                <span class="mono">${cat.percentage}%</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: ${cat.percentage}%; background-color: ${cat.color};"></div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- Growth markets list -->
      <div class="border border-slate-200 p-4 rounded-2xl">
        <h3 class="text-xs font-bold text-slate-700 uppercase mono mb-3 text-left">Key Territory Growth</h3>
        <div class="space-y-2">
          ${data.customerGrowth
            .map(
              (loc) => `
            <div class="flex justify-between items-center text-xs py-1 border-b border-slate-100">
              <span class="font-medium">${loc.location}</span>
              <span class="mono font-bold text-emerald-750">+${loc.percentage}% growth</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>

    <!-- Transactions ledger list -->
    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mono mb-4 page-break">IV. Portfolio Operations Ledger</h2>
    <div class="overflow-x-auto mb-8">
      <table class="w-full border-collapse border border-slate-200 text-xs">
        <thead>
          <tr class="bg-slate-100 mono text-left text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <th class="border border-slate-200 py-2 px-3">ID</th>
            <th class="border border-slate-200 py-2 px-3">Client Partner Name</th>
            <th class="border border-slate-200 py-2 px-3">Revenue Value</th>
            <th class="border border-slate-200 py-2 px-3">Orders</th>
            <th class="border border-slate-200 py-2 px-3">Region</th>
            <th class="border border-slate-200 py-2 px-3 text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.recentTransactions
            .map(
              (tx) => `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="border border-slate-200 py-2 px-3 mono font-bold text-slate-400">${tx.id}</td>
              <td class="border border-slate-200 py-2 px-3 font-bold">${tx.name}</td>
              <td class="border border-slate-200 py-2 px-3 font-bold mono">$${tx.revenue.toLocaleString()}</td>
              <td class="border border-slate-200 py-2 px-3 mono">${tx.orders}</td>
              <td class="border border-slate-200 py-2 px-3">${tx.region}</td>
              <td class="border border-slate-200 py-2 px-3 text-right mono text-slate-400">${tx.date}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Footer of the report -->
    <div class="border-t border-slate-200 pt-6 mt-12 flex justify-between items-center text-[10px] text-slate-400 mono">
      <span>Authenticated Sec Node: Teyzix Analytics Core</span>
      <span>Status Code: SIGNED-OK</span>
      <span>2026 Teyzix Global</span>
    </div>

    <!-- Interactive Options Panel in browser -->
    <div class="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center no-print">
      <div>
        <p class="text-xs font-bold text-indigo-900">Locally Loaded Offline Report</p>
        <p class="text-[11px] text-indigo-750 mt-0.5">To convert to high-fidelity PDF, press Ctrl+P (Cmd+P) inside your browser!</p>
      </div>
      <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-750 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-all">
        Direct Print File
      </button>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Teyzix_Analytics_Executive_Report_${new Date().toISOString().substring(0, 10)}.html`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export Trigger
  const handleExportPDF = () => {
    setIsExportModalOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldAlert className="w-7 h-7 stroke-[2]" />
          </div>

          <h1 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">
            {t.errorText}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-mono bg-zinc-100 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/40 dark:border-zinc-850/40 leading-relaxed text-left">
            {error}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                setSimulatedError(false);
                fetchData();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 hover:opacity-90 shadow-md cursor-pointer transition-all hover:scale-[1.02]"
              id="error-recovery-retry-btn"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{t.retry}</span>
            </button>
            <button
              onClick={() => {
                setSimulatedError(false);
                resetFilters();
                fetchData();
              }}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer py-1"
            >
              Clear Simulator Parameters
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans"
      id="app-viewport"
    >
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          isLoadingData={isLoading}
        />
      )}
      <SidebarNavigation />

      <div className="md:pl-20 min-h-screen w-full flex flex-col justify-between pb-16 md:pb-6">
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 flex-1">
          <HeaderSection />

          {activeTab === "overview" && (
            <>
              {/* Top-row corporate KPI summary figures */}
              <KpiMetrics />

              {/* Line chart & AI helper side-by-side bento layout */}
              <div
                className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch"
                id="middle-bento-grid"
              >
                {/* Revenue Trends Line Chart */}
                <div className="xl:col-span-8 flex flex-col justify-between">
                  <SalesTrackingTrendCard />
                </div>

                {/* AI Copilot Input widget*/}
                <div className="xl:col-span-4 flex flex-col justify-between">
                  <CopilotWidget />
                </div>
              </div>

              {/* Secondary Grid Section for categorized demand metrics */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                id="charts-grid"
              >
                <MarketDemandCard />
                <CustomerGrowthCard />
                <SalesComparisonRangeCard />
                <WeeklyTotalRevenueCard />
              </div>

              {/* Detailed customer ledger table with modular controls */}
              <div className="col-span-12" id="customer-ledger-wrap">
                <CustomerTable />
              </div>
            </>
          )}

          {activeTab === "analytics" && <AnalyticsPage />}

          {activeTab === "companies" && <CompaniesPage />}

          {activeTab === "accounts" && <AccountsPage />}

          {activeTab === "help" && <HelpPage />}

          {activeTab === "profile" && <ProfilePage />}

          {selectedCompanyInfoId && (
            <CompanyInfoModal
              companyId={selectedCompanyInfoId}
              onClose={() => setSelectedCompanyInfoId(null)}
            />
          )}

          {/* Page Footer / Advanced PDF print summary controls */}
          <footer className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200/50 dark:border-zinc-805/40 pt-6 text-zinc-400 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-505" />
              <span className="font-mono">
                Enterprise Node ID: Teyzi-core-X
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Standard / Direct Local Browser Print Button - Ideal for VSCode / Local usage */}
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition-all hover:scale-[1.03] shadow-sm active:scale-95"
                id="direct-browser-print-btn"
                title="Direct local browser PDF print (optimal for running via VSCode)"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                <span>Local Browser Print</span>
              </button>

              {/* <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-755 hover:scale-103 shadow-md border border-indigo-500/20 dark:border-indigo-800/40 cursor-pointer transition-all"
              id="dashboard-export-pdf-btn"
              title="Print standard, single-sheet layout containing data charts"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.pdfExport}</span>
            </button> */}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
