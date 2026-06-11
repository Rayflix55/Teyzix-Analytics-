/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Building,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Activity,
  FileCheck,
  Briefcase,
  X,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import { motion, AnimatePresence } from "motion/react";

interface CompanyCRMRecord {
  id: string;
  companyName: string;
  repName: string;
  revenue: number;
  orders: number;
  status: "Active" | "Pending" | "Inactive";
  region: string;
  avatar: string;
  industry: string;
  size: "Enterprise" | "Mid-Market" | "SMB";
  healthScore: number; // 0-100 rating
  phone: string;
  email: string;
  description: string;
}

export default function CompaniesPage() {
  const {
    data,
    isLoading,
    language,
    setActiveTab,
    setSelectedCompanyForAnalytics,
  } = useDashboardStore();
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<
    "All" | "Enterprise" | "Mid-Market" | "SMB"
  >("All");
  const [selectedHealth, setSelectedHealth] = useState<
    "All" | "Excellent" | "At-Risk"
  >("All");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [syncingCompanyId, setSyncingCompanyId] = useState<string | null>(null);
  const [completedSyncCompanyId, setCompletedSyncCompanyId] = useState<
    string | null
  >(null);

  const handleRunSync = (companyId: string) => {
    setSyncingCompanyId(companyId);
    setCompletedSyncCompanyId(null);
    setTimeout(() => {
      setSyncingCompanyId(null);
      setCompletedSyncCompanyId(companyId);
      setTimeout(() => {
        setCompletedSyncCompanyId((prev) => (prev === companyId ? null : prev));
      }, 3000);
    }, 1500);
  };

  const companyRecords = useMemo<CompanyCRMRecord[]>(() => {
    if (!data) return [];

    const industries = [
      "Financial Services",
      "Hardware Products",
      "Global Supply Chain",
      "E-Commerce Logistics",
      "Sustainable Agro",
      "Entertainment Platforms",
      "Consumer Electronics",
      "Heavy Machinery",
      "Professional Services",
      "Creative Design agency",
      "Global Retail",
      "Maritime Assets",
    ];
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
      const size: "Enterprise" | "Mid-Market" | "SMB" =
        tx.revenue > 18000
          ? "Enterprise"
          : tx.revenue > 10000
            ? "Mid-Market"
            : "SMB";
      const healthScore =
        Math.floor(tx.revenue / 260) + (tx.status === "Active" ? 10 : -10) + 40;
      const sanitizedHealth = Math.min(100, Math.max(15, healthScore));

      const firstName = tx.name.split(" ")[0] || "Client";
      const lastName = tx.name.split(" ")[1] || "Group";

      return {
        id: tx.id,
        companyName: `${lastName} ${corporateSuffix[idx % corporateSuffix.length]}`,
        repName: tx.name,
        revenue: tx.revenue,
        orders: tx.orders,
        status: tx.status,
        region: tx.region,
        avatar: tx.avatar,
        industry: industries[idx % industries.length],
        size,
        healthScore: sanitizedHealth,
        phone: `+1-555-019-${Math.floor(1000 + Math.random() * 9000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@executive-hub.org`,
        description: `Delivering top-tier consulting and supply-chain parameters in support of ${tx.region}-based multi-entity clearance schedules.`,
      };
    });
  }, [data]);

  React.useEffect(() => {
    if (companyRecords.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companyRecords[0].id);
    }
  }, [companyRecords, selectedCompanyId]);

  const filteredCompanies = useMemo(() => {
    return companyRecords.filter((c) => {
      const matchText =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.repName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSize = selectedSize === "All" || c.size === selectedSize;

      let matchHealth = true;
      if (selectedHealth === "Excellent") matchHealth = c.healthScore >= 75;
      if (selectedHealth === "At-Risk") matchHealth = c.healthScore < 50;

      return matchText && matchSize && matchHealth;
    });
  }, [companyRecords, searchQuery, selectedSize, selectedHealth]);

  const activeCompany = useMemo(() => {
    return companyRecords.find((c) => c.id === selectedCompanyId) || null;
  }, [companyRecords, selectedCompanyId]);

  if (isLoading || !data) {
    return (
      <div className="bg-white/70 dark:bg-zinc-900/40 p-6 rounded-3xl animate-pulse min-h-[400px]">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 h-80 bg-zinc-200 dark:bg-zinc-850 rounded-2xl"></div>
          <div className="col-span-2 h-80 bg-zinc-200 dark:bg-zinc-850 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="crm-workspace-container">
      {/* Search and Parameter Settings Top Row */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 bg-white/50 dark:bg-zinc-90 w bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-4 rounded-3xl backdrop-blur-md shadow-sm"
        id="crm-controls-banner"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, leads, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/30 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Categories toggling attributes */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center text-xs text-zinc-500 gap-1.5 font-mono">
            <span>Size:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as any)}
              className="p-1 px-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg outline-none text-[11px] font-bold"
            >
              <option value="All">All Sizes</option>
              <option value="Enterprise">Enterprise (&gt;18k)</option>
              <option value="Mid-Market">Mid-Market (10k-18k)</option>
              <option value="SMB">SMB (&lt;10k)</option>
            </select>
          </div>

          <div className="flex items-center text-xs text-zinc-500 gap-1.5 font-mono">
            <span>Health Risk:</span>
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value as any)}
              className="p-1 px-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg outline-none text-[11px] font-bold"
            >
              <option value="All">All Healths</option>
              <option value="Excellent">Excellent (&gt;=75)</option>
              <option value="At-Risk">At Risk (&lt;50)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CRM Main Bento Grid split details vs active list */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        id="crm-dual-grid"
      >
        {/* Left Side Company Records List */}
        <div
          className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1.5 scrollbar-thin"
          id="crm-list-column"
        >
          <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider ml-1">
            Registered Portfolio Accounts ({filteredCompanies.length})
          </div>

          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((comp) => {
              const isSelected = selectedCompanyId === comp.id;

              const getHealthColor = (score: number) => {
                if (score >= 75) return "bg-emerald-500";
                if (score >= 50) return "bg-amber-400";
                return "bg-rose-500";
              };

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompanyId(comp.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 shadow-md"
                      : "bg-white/70 dark:bg-zinc-900/40 border-zinc-200/40 dark:border-zinc-800/30 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  id={`comp-card-${comp.id}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Tiny initial letters indicator */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? "bg-white/11 text-white dark:bg-zinc-900/10 dark:text-zinc-950"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-650"
                      }`}
                    >
                      {comp.companyName.substring(0, 2)}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold font-sans">
                        {comp.companyName}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 group-hover:text-amber-500 transition-colors font-sans">
                        <span>{comp.industry}</span>
                        <span>•</span>
                        <span className="font-mono font-semibold">
                          ${comp.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Health dot */}
                    <span
                      className={`w-2 h-2 rounded-full ${getHealthColor(comp.healthScore)}`}
                      title={`Account Health Score: ${comp.healthScore}/100`}
                    />
                    <ChevronRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isSelected ? "text-amber-400" : "text-zinc-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-950/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-xs text-zinc-400 font-mono">
              No enterprise entities match the specified filters.
            </div>
          )}
        </div>

        {/* Right Side Corporate Audit Profile Details */}
        <div className="lg:col-span-7" id="crm-profile-column">
          <AnimatePresence mode="wait">
            {activeCompany ? (
              <motion.div
                key={activeCompany.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-6 rounded-3xl shadow-sm backdrop-blur-md space-y-6 h-full flex flex-col justify-between"
                id="active-crm-profile-panel"
              >
                {/* Header section with representative coordinates */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-850 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl flex items-center justify-center">
                        <Building className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white font-sans">
                          {activeCompany.companyName}
                        </h3>
                        <p className="text-xs text-indigo-505 dark:text-indigo-405 font-mono">
                          Entity Node Code ID: {activeCompany.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350">
                        {activeCompany.size} Segment
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-1 rounded border ${
                          activeCompany.status === "Active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/10 dark:text-emerald-400"
                            : activeCompany.status === "Pending"
                              ? "border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/10 dark:text-amber-400"
                              : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {activeCompany.status} Account
                      </span>
                    </div>
                  </div>

                  {/* Summary details indicators */}
                  <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    id="crm-metrics-grid"
                  >
                    <div className="p-3 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/20 text-center">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
                        Contract Value
                      </span>
                      <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono mt-1 inline-block">
                        ${activeCompany.revenue.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/20 text-center">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
                        Completed Orders
                      </span>
                      <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono mt-1 inline-block">
                        {activeCompany.orders} deliveries
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/20 text-center">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
                        Risk Rating Target
                      </span>
                      <span className="text-sm font-extrabold text-indigo-505 dark:text-indigo-451 font-mono mt-1 inline-block">
                        {activeCompany.healthScore}%
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/20 text-center">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
                        Main Region
                      </span>
                      <span className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-sans mt-2 inline-block">
                        {activeCompany.region}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Analytics Link/Banner */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-150/40 dark:border-indigo-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-slate-100/50 dark:hover:bg-zinc-800/30">
                    <div className="space-y-0.5 text-left">
                      <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-300">
                        Targeted Revenue & Projection Analytics
                      </h4>
                      <p className="text-[11px] text-indigo-755 dark:text-indigo-400/80 leading-relaxed">
                        Assess financial runways, forecast margins, and model
                        demand curves for {activeCompany.companyName}.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCompanyForAnalytics(activeCompany.id);
                        setActiveTab("analytics");
                      }}
                      className="whitespace-nowrap px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[10px] rounded-xl cursor-pointer transition-all active:scale-95 shadow hover:scale-[1.02]"
                      title={`Open Analytics sandbox pre-loaded with ${activeCompany.companyName}`}
                    >
                      VIEW ANALYTICS →
                    </button>
                  </div>

                  {/* Representative Card Coordinates */}
                  <div className="bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-850/40 p-4 rounded-2xl space-y-3.5">
                    <h4 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-505" />
                      <span>Dedicated Lead Client Contact</span>
                    </h4>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeCompany.avatar}
                          alt={activeCompany.repName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        />
                        <div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-white font-sans block">
                            {activeCompany.repName}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold mt-0.5">
                            Corporate Representative
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{activeCompany.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{activeCompany.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Industry focus and detailed performance analysis */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#f3c623]" />
                      <span>Corporate Description & Operations</span>
                    </h4>
                    <p className="text-xs text-zinc-505 dark:text-zinc-400 leading-relaxed font-sans bg-zinc-50/30 dark:bg-zinc-950/10 p-3 rounded-2xl border border-zinc-200/20 dark:border-zinc-800/10">
                      {activeCompany.description}
                    </p>
                  </div>
                </div>

                {/* Audit confirmation button footer */}
                <div className="border-t border-zinc-200/50 dark:border-zinc-850 pt-4 mt-4 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-zinc-400">
                    <FileCheck
                      className={`w-4 h-4 ${completedSyncCompanyId === activeCompany.id ? "text-indigo-505 animate-bounce" : "text-emerald-500"}`}
                    />
                    <span>
                      {syncingCompanyId === activeCompany.id
                        ? "SYNCHRONIZING SECURE NODE..."
                        : completedSyncCompanyId === activeCompany.id
                          ? "SYNC COMPLETED SUCCESSFULLY"
                          : "LATEST SYNC COMPLETED: 2026-06-11"}
                    </span>
                  </div>

                  <button
                    disabled={syncingCompanyId === activeCompany.id}
                    onClick={() => handleRunSync(activeCompany.id)}
                    className={`px-3 py-1.5 text-[11px] font-extrabold font-mono rounded-lg active:scale-98 transition-all cursor-pointer ${
                      syncingCompanyId === activeCompany.id
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                        : completedSyncCompanyId === activeCompany.id
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90"
                    }`}
                  >
                    {syncingCompanyId === activeCompany.id
                      ? "SYNCING..."
                      : completedSyncCompanyId === activeCompany.id
                        ? "SECURE SIGN"
                        : "RUN SYNC DRILL"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-6 rounded-3xl h-full flex flex-col items-center justify-center text-center text-zinc-400 font-mono text-xs">
                Select an enterprise from the portfolio menu to launch security
                audits.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
