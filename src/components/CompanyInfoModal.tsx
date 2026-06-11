/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Activity,
  Briefcase,
  FileCheck,
  X,
  ShieldCheck,
  ArrowUpRight,
  BarChart2,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import { motion } from "motion/react";

interface CompanyInfoModalProps {
  companyId: string;
  onClose: () => void;
}

export default function CompanyInfoModal({
  companyId,
  onClose,
}: CompanyInfoModalProps) {
  const { data, language, setActiveTab, setSelectedCompanyForAnalytics } =
    useDashboardStore();
  const t = translations[language];

  const [syncing, setSyncing] = useState(false);
  const [completeSync, setCompleteSync] = useState(false);

  const activeCompany = useMemo(() => {
    if (!data) return null;

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

    const txIdx = data.recentTransactions.findIndex(
      (tx) => tx.id === companyId,
    );
    if (txIdx === -1) return null;

    const tx = data.recentTransactions[txIdx];
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
      companyName: `${lastName} ${corporateSuffix[txIdx % corporateSuffix.length]}`,
      repName: tx.name,
      revenue: tx.revenue,
      orders: tx.orders,
      status: tx.status,
      region: tx.region,
      avatar: tx.avatar,
      industry: industries[txIdx % industries.length],
      size,
      healthScore: sanitizedHealth,
      phone: `+1-555-019-${1000 + txIdx * 7}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@executive-hub.org`,
      description: `Delivering top-tier consulting and supply-chain parameters in support of ${tx.region}-based multi-entity clearance schedules.`,
    };
  }, [data, companyId]);

  const handleRunSync = () => {
    setSyncing(true);
    setCompleteSync(false);
    setTimeout(() => {
      setSyncing(false);
      setCompleteSync(true);
      setTimeout(() => {
        setCompleteSync(false);
      }, 3000);
    }, 1500);
  };

  const handleGoToAnalytics = () => {
    if (activeCompany) {
      setSelectedCompanyForAnalytics(activeCompany.id);
      setActiveTab("analytics");
      onClose();
    }
  };

  if (!activeCompany) return null;

  const getHealthStyle = (score: number) => {
    if (score >= 75)
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-500",
        pill: "bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/20",
      };
    if (score >= 50)
      return {
        dot: "bg-amber-400",
        text: "text-amber-500",
        pill: "bg-amber-400/10 dark:bg-amber-400/10 border-amber-400/20",
      };
    return {
      dot: "bg-rose-500",
      text: "text-rose-500",
      pill: "bg-rose-500/10 dark:bg-rose-500/10 border-rose-500/20",
    };
  };

  const healthStyle = getHealthStyle(activeCompany.healthScore);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
      id="company-info-modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Absolute header pattern decoration */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all cursor-pointer"
          id="close-modal-btn"
          title="Close details popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ribbon info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-850 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Building className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-sans tracking-tight">
                {activeCompany.companyName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  {activeCompany.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-zinc-300 dark:text-zinc-600">
                  |
                </span>
                <span className="text-xs font-semibold text-indigo-505 dark:text-indigo-405 font-sans">
                  {activeCompany.industry}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start md:self-center">
            <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350">
              {activeCompany.size}
            </span>
            <span
              className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-xl border ${
                activeCompany.status === "Active"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/10 dark:text-emerald-400"
                  : activeCompany.status === "Pending"
                    ? "border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/10 dark:text-amber-400"
                    : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {activeCompany.status}
            </span>
          </div>
        </div>

        {/* Quant Metrics Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6"
          id="modal-metrics-grid"
        >
          <div className="p-3.5 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/10 text-center">
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Contract Value
            </span>
            <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono mt-1 inline-block">
              ${activeCompany.revenue.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/10 text-center">
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Completed Deliveries
            </span>
            <span className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono mt-1 inline-block">
              {activeCompany.orders} shipments
            </span>
          </div>

          <div className="p-3.5 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/10 text-center">
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Risk Rating
            </span>
            <div
              className={`text-sm font-extrabold font-mono mt-1 flex items-center justify-center gap-1.5 ${healthStyle.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${healthStyle.dot}`} />
              <span>{activeCompany.healthScore}%</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50/60 dark:bg-zinc-950/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/10 text-center">
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Coverage Region
            </span>
            <span className="text-xs font-bold text-zinc-750 dark:text-zinc-300 font-sans mt-1.5 inline-block truncate w-full">
              {activeCompany.region}
            </span>
          </div>
        </div>

        {/* Representative & Description info columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Left: Contact */}
          <div className="bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-205 dark:border-zinc-850/40 p-4 rounded-2xl space-y-4">
            <h4 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-505" />
              <span>Executive Contact</span>
            </h4>

            <div className="flex items-center gap-3">
              <img
                src={activeCompany.avatar}
                alt={activeCompany.repName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-white font-sans block">
                  {activeCompany.repName}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Key Accounts Manager
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-zinc-650 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span className="truncate">{activeCompany.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>{activeCompany.phone}</span>
              </div>
            </div>
          </div>

          {/* Right: Operations & Description */}
          <div className="flex flex-col justify-between space-y-4 bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-205 dark:border-zinc-850/40 p-4 rounded-2xl">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>Description Details</span>
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                {activeCompany.description}
              </p>
            </div>

            {/* Offline cap/health risk block */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/15 rounded-xl flex items-center gap-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Full compliance & secure clearance node verified on UTC
                2026-06-11.
              </span>
            </div>
          </div>
        </div>

        {/* Buttons / Actions Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/50 dark:border-zinc-850 pt-5 mt-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-zinc-400 text-left">
            <FileCheck
              className={`w-4 h-4 ${completeSync ? "text-indigo-505 animate-bounce" : "text-emerald-500"}`}
            />
            <span>
              {syncing
                ? "SYNCING NODE SECURELY..."
                : completeSync
                  ? "COMPLETED SUCCESSFULLY"
                  : "LATEST SYNC COMPLETED"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Run Sync Drill */}
            <button
              disabled={syncing}
              onClick={handleRunSync}
              className={`px-3.5 py-2 text-xs font-bold font-mono rounded-xl cursor-pointer transition-all active:scale-95 ${
                syncing
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  : completeSync
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750"
              }`}
            >
              {syncing
                ? "SYNCING..."
                : completeSync
                  ? "SYNCED"
                  : "RUN SYNC DRILL"}
            </button>

            {/* View Deep Analytics */}
            <button
              onClick={handleGoToAnalytics}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
              title="Launch Analytics deep-dive view with this company preselected"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>ANALYTICS DEEP-DIVE</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
