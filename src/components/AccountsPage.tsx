/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  RefreshCw,
  Layers,
  MapPin,
  CheckCircle,
  Clock,
  StopCircle,
  User,
  TrendingUp,
  FileSpreadsheet,
  X,
  Sparkles,
  Tag,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import {
  CustomerTransaction,
  CustomerStatus,
  Region,
} from "../types/dashboard";
import { motion, AnimatePresence } from "motion/react";

export default function AccountsPage() {
  const { data, isLoading, language } = useDashboardStore();
  const t = translations[language];

  const [ledgerList, setLedgerList] = useState<CustomerTransaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (data && !isInitialized) {
      setLedgerList(data.recentTransactions);
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newClientName, setNewClientName] = useState("");
  const [newRevenue, setNewRevenue] = useState("");
  const [newOrders, setNewOrders] = useState("");
  const [newRegion, setNewRegion] = useState<Region>("North America");
  const [newStatus, setNewStatus] = useState<CustomerStatus>("Pending");

  const stats = useMemo(() => {
    const total = ledgerList.reduce((sum, item) => sum + item.revenue, 0);
    const pendingTotal = ledgerList
      .filter((item) => item.status === "Pending")
      .reduce((sum, item) => sum + item.revenue, 0);
    const activeCount = ledgerList.filter(
      (item) => item.status === "Active",
    ).length;
    const pendingCount = ledgerList.filter(
      (item) => item.status === "Pending",
    ).length;

    return { total, pendingTotal, activeCount, pendingCount };
  }, [ledgerList]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newRevenue) return;

    const newTx: CustomerTransaction = {
      id: `TX-${1000 + ledgerList.length + 1}`,
      name: newClientName,
      revenue: parseFloat(newRevenue) || 1200,
      orders: parseInt(newOrders, 10) || 5,
      status: newStatus,
      region: newRegion,
      date: new Date().toISOString().substring(0, 10),
      avatar: `https://images.unsplash.com/photo-${1490000000000 + Math.floor(Math.random() * 1000000)}?w=100&fit=crop&q=80`,
    };

    setLedgerList([newTx, ...ledgerList]);
    setIsModalOpen(false);

    setNewClientName("");
    setNewRevenue("");
    setNewOrders("");
    setNewRegion("North America");
    setNewStatus("Pending");
  };

  const handleToggleStatus = (id: string) => {
    const updated = ledgerList.map((tx) => {
      if (tx.id === id) {
        let nextStatus: CustomerStatus = "Active";
        if (tx.status === "Active") nextStatus = "Inactive";
        else if (tx.status === "Inactive") nextStatus = "Pending";
        return { ...tx, status: nextStatus };
      }
      return tx;
    });
    setLedgerList(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    setLedgerList(ledgerList.filter((tx) => tx.id !== id));
  };

  if (isLoading || !data) {
    return (
      <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 p-5 rounded-3xl animate-pulse min-h-[350px]">
        <div className="space-y-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
          <div className="h-24 bg-zinc-200 dark:bg-zinc-850 rounded-2xl"></div>
          <div className="h-40 bg-zinc-200 dark:bg-zinc-850 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="ledger-operations-main">
      {/* KPI stats bar dedicated for Accounts */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        id="accounts-stats-row"
      >
        <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <DollarSign className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Ledger Volume
            </span>
            <span className="text-lg font-extrabold text-zinc-900 dark:text-white font-mono mt-0.5 inline-block">
              ${stats.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Pending Clearance
            </span>
            <span className="text-lg font-extrabold text-[#f3c623] font-mono mt-0.5 inline-block">
              ${stats.pendingTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <CheckCircle className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Approved Node Partners
            </span>
            <span className="text-lg font-extrabold text-indigo-505 font-mono mt-0.5 inline-block">
              {stats.activeCount} accounts
            </span>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl shadow-sm backdrop-blur-md flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block">
              Awaiting Clearance
            </span>
            <span className="text-lg font-extrabold text-amber-400 font-mono mt-0.5 inline-block">
              {stats.pendingCount} pending
            </span>
          </div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div
        className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md"
        id="ledger-table-panel"
      >
        {/* Banner with header operations */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans">
              Billing Ledger Directory
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
              Maintain company invoice pipelines. Click on the invoice status
              badge to cycles active statuses.
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-sans rounded-xl shadow-md cursor-pointer transition-transform duration-150 active:scale-97"
            id="open-add-billing-modal"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Billings</span>
          </button>
        </div>

        {/* Dense Responsive Grid Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/55 dark:border-zinc-800/40 text-[9px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                <th className="py-2.5 px-2">TX Ref</th>
                <th className="py-2.5 px-2">Clearing Account Name</th>
                <th className="py-2.5 px-2">Total Value</th>
                <th className="py-2.5 px-2">Region Path</th>
                <th className="py-2.5 px-2">Clearance Status</th>
                <th className="py-2.5 px-2 text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/15 text-xs font-sans">
              {ledgerList.length > 0 ? (
                ledgerList.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group"
                    id={`ledger-row-${tx.id}`}
                  >
                    <td className="py-3 px-2 font-mono text-[11px] text-zinc-400 font-bold group-hover:text-indigo-505 transition-colors">
                      {tx.id}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <img
                          className="w-6.5 h-6.5 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                          src={tx.avatar}
                          alt={tx.name}
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-bold text-zinc-900 dark:text-white capitalize">
                          {tx.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-2 font-bold font-mono">
                      ${tx.revenue.toLocaleString()}
                    </td>

                    <td className="py-3 px-2 font-medium text-zinc-505">
                      {tx.region}
                    </td>

                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleToggleStatus(tx.id)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                          tx.status === "Active"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : tx.status === "Pending"
                              ? "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                              : "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-805 dark:text-zinc-400"
                        }`}
                        title="Click to toggle billing status"
                      >
                        {tx.status}
                      </button>
                    </td>

                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="text-zinc-400 hover:text-rose-500 font-semibold transition-colors cursor-pointer p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Delete this ledger line"
                        id={`delete-ledger-${tx.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-zinc-400 font-mono text-xs"
                  >
                    💡 Ledger list is currently empty. Generated bills will
                    appear here immediately.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal form overlay for robust CRUD billing creations */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
            id="ledger-creation-modal"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              {/* Reset form trigger */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4.5 top-4.5 p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-850 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-505" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
                  Generate Corporate Billings Ledger
                </h3>
              </div>

              {/* Action Form */}
              <form
                onSubmit={handleAddTransaction}
                className="space-y-4 text-xs font-sans"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">
                    Account Clearing Client Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp Holdings"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">
                      Total Revenue ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        required
                        placeholder="e.g. 15400"
                        value={newRevenue}
                        onChange={(e) => setNewRevenue(e.target.value)}
                        className="w-full pl-7 pr-2 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">
                      Orders count
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 8"
                      value={newOrders}
                      onChange={(e) => setNewOrders(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 rounded-xl outline-none focus:ring-1 focus:ring-indigo-505 text-zinc-800 dark:text-zinc-105"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">
                      Territory Region
                    </label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value as any)}
                      className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl focus:ring-1 focus:ring-indigo-500 text-zinc-805 dark:text-zinc-100 outline-none"
                    >
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia Pacific">Asia Pacific</option>
                      <option value="Middle East">Middle East</option>
                      <option value="South America">South America</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">
                      Initial Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full p-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl focus:ring-1 focus:ring-indigo-505 text-zinc-805 dark:text-zinc-100 outline-none"
                    >
                      <option value="Pending">Pending Clearance</option>
                      <option value="Active">Cleared (Active)</option>
                      <option value="Inactive">Held (Inactive)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold font-mono text-xs rounded-xl shadow-lg hover:shadow-indigo-500/10 cursor-pointer transition-transform duration-150 active:scale-97 mt-2"
                >
                  ADD LEDGER LINE
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
