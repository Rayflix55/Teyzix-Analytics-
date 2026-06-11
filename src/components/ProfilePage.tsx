/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  MapPin,
  Key,
  Laptop,
  Sliders,
  Check,
  Copy,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";

export default function ProfilePage() {
  const { language, theme, toggleTheme } = useDashboardStore();
  const t = translations[language];

  const [sessionUser, setSessionUser] = useState({
    name: "Jonathon SR",
    email: "rayflix55@gmail.com",
    role: "Chief Treasury Advisor",
    nodeCode: "BENTO-SEC-ADVISOR-01",
    signatureKey: "sha256-f4a4bc938b8c1990fc7e9b...signed-ok",
  });

  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(sessionUser.signatureKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="profile-workspace-view">
      <div className="bg-zinc-900 border border-zinc-850 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 text-center sm:text-left">
          <div className="w-16 h-16 rounded-3xl p-1 bg-gradient-to-tr from-yellow-300 via-indigo-505 to-emerald-500 shadow-lg">
            <img
              className="w-full h-full rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80"
              alt="Corporate Profile"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans text-left">
              {sessionUser.name}
            </h2>
            <p className="text-xs text-indigo-400 font-mono text-left">
              {sessionUser.role} • Security Level SEC NOC-01
            </p>
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 backdrop-blur-md px-5 py-3 rounded-2xl flex flex-col justify-center text-left font-sans w-full sm:w-auto">
          <span className="text-[9px] font-bold font-mono uppercase text-zinc-400 block">
            Current Access Token
          </span>
          <span className="text-xs font-bold text-emerald-450 font-mono mt-0.5">
            VALID-ACTIVE-2026
          </span>
          <span className="text-[9px] text-zinc-400 block mt-0.5">
            Last verified: Today, 07:01 UTC
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div
          className="col-span-12 lg:col-span-7 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md"
          id="profile-coordinates-card"
        >
          <h3 className="text-sm font-bold text-zinc-904 dark:text-white font-sans text-left border-b border-zinc-100 dark:border-zinc-850 pb-3 mb-5">
            Security Coordinates & Account Details
          </h3>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase tracking-wider block">
                  Full Advisor Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={sessionUser.name}
                    onChange={(e) =>
                      setSessionUser({ ...sessionUser, name: e.target.value })
                    }
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-950/20 rounded-xl outline-none focus:ring-1 focus:ring-indigo-505 text-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase tracking-wider block">
                  Verified System Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    value={sessionUser.email}
                    onChange={(e) =>
                      setSessionUser({ ...sessionUser, email: e.target.value })
                    }
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-950/20 rounded-xl outline-none focus:ring-1 focus:ring-indigo-505 text-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase tracking-wider block">
                  Corporate Role
                </label>
                <input
                  type="text"
                  value={sessionUser.role}
                  onChange={(e) =>
                    setSessionUser({ ...sessionUser, role: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-white/30 dark:bg-zinc-950/20 rounded-xl outline-none focus:ring-1 focus:ring-indigo-505 text-zinc-850 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase tracking-wider block">
                  Target Node Code
                </label>
                <input
                  type="text"
                  readOnly
                  value={sessionUser.nodeCode}
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 rounded-xl outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 text-left pt-2 border-t border-zinc-100 dark:border-zinc-850">
              <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase tracking-wider block">
                Cryptographic Signature Key (Used in CSV & PDF logs)
              </label>
              <div className="flex gap-2">
                <input
                  type={showKey ? "text" : "password"}
                  readOnly
                  value={sessionUser.signatureKey}
                  className="flex-1 text-[11px] font-mono px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-600 dark:text-zinc-400 rounded-xl outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="px-3 py-2 bg-zinc-100 hover:bg-zinc-205 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-650 dark:text-zinc-200 text-xs font-bold rounded-xl outline-none cursor-pointer"
                >
                  {showKey ? "Hide" : "Reveal"}
                </button>

                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="p-2 px-3 bg-zinc-900 hover:opacity-90 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold rounded-xl outline-none flex items-center justify-center cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Global Settings & Preferences Card */}
        <div
          className="col-span-12 lg:col-span-5 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md space-y-4"
          id="profile-preferences-card"
        >
          <h3 className="text-sm font-bold text-zinc-954 dark:text-white font-sans text-left border-b border-zinc-100 dark:border-zinc-850 pb-3 mb-1">
            Workspace Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-zinc-50/55 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-850/40 rounded-2xl">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-zinc-805 dark:text-white font-sans block">
                  Workspace Night Vision Mode
                </span>
                <span className="text-[10px] text-zinc-400 leading-normal block">
                  Toggles system appearance dark state seamlessly.
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 active:scale-95 transition-all text-xs font-bold cursor-pointer"
              >
                Toggle Theme
              </button>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/15 rounded-2xl text-left space-y-2">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
                <span>Offline Storage Authorized</span>
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                LocalStorage has been mapped on this browser node. Secure
                credentials, languages, and dashboard preferences will persist
                across full workspace updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
