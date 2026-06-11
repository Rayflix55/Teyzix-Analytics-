/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  LayoutGrid,
  Bell,
  MapPin,
  Globe,
  Settings,
  HelpCircle,
  TrendingUp,
  Sliders,
  DollarSign,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import TeyzixLogo from "./TeyzixLogo";

export default function SidebarNavigation() {
  const { theme, language, activeTab, setActiveTab } = useDashboardStore();
  const t = translations[language];

  const menuItems = [
    { id: "overview" as const, icon: LayoutGrid, label: t.dashboardTitle },
    {
      id: "analytics" as const,
      icon: TrendingUp,
      label: "Interactive Analytics",
    },
    { id: "companies" as const, icon: MapPin, label: "Portfolio CRM" },
    { id: "accounts" as const, icon: Globe, label: "Ledger Accounts" },
  ];

  return (
    <aside className="hidden md:flex fixed top-0 left-0 w-20 bg-[#fafafa]/80 dark:bg-zinc-950/80 backdrop-blur-md border-r border-zinc-200/50 dark:border-zinc-800/40 z-40 transition-colors duration-300 flex-col justify-between items-center py-6 h-screen">
      <div className="flex flex-col items-center gap-1 mb-8">
        <button
          onClick={() => setActiveTab("overview")}
          className="cursor-pointer transition-transform duration-300 hover:scale-105"
          title="Teyzix Analytics Core"
        >
          <TeyzixLogo className="w-11 h-11" glow={activeTab === "overview"} />
        </button>
      </div>

      <nav className="flex flex-col gap-4 w-auto items-center justify-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative p-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-950 dark:text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
              title={item.label}
              id={`sidebar-tab-${item.id}`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="absolute left-16 hidden group-hover:inline-block bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs py-1 px-2.5 rounded-md shadow-md whitespace-nowrap z-50">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-505"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setActiveTab("help")}
          className={`p-3 rounded-xl transition-colors cursor-pointer relative group ${
            activeTab === "help"
              ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white"
              : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white active:scale-95"
          }`}
          title="Security Audits & Support Documentation"
          id="sidebar-tab-help"
        >
          <HelpCircle className="w-5.5 h-5.5" />
          <span className="absolute left-16 hidden group-hover:inline-block bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs py-1 px-2.5 rounded-md shadow-md whitespace-nowrap z-50">
            System Guide & FAQ
          </span>
          {activeTab === "help" && (
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#f3c623]"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`w-11 h-11 rounded-full p-0.5 shadow-inner transition-all duration-300 relative group cursor-pointer active:scale-95 ${
            activeTab === "profile"
              ? "ring-2 ring-indigo-505 dark:ring-white scale-105"
              : "ring-1 ring-zinc-200 dark:ring-zinc-800 hover:ring-zinc-400/80 dark:hover:ring-zinc-600"
          }`}
          title="User Account & Workspace Profile"
          id="sidebar-tab-profile"
        >
          <img
            className="w-full h-full rounded-full object-cover shadow-sm bg-gradient-to-tr from-yellow-300 to-indigo-500"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"
            alt="Corporate Profile"
            referrerPolicy="no-referrer"
          />
          <span className="absolute left-16 hidden group-hover:inline-block bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs py-1 px-2.5 rounded-md shadow-md whitespace-nowrap z-50">
            Rayflix Jnr Profile
          </span>
          {activeTab === "profile" && (
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950"></span>
          )}
        </button>
      </div>
    </aside>
  );
}
