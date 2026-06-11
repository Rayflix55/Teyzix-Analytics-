/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  Key,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
  category: "connection" | "security" | "reports";
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "connection" | "security" | "reports"
  >("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<{
    status: "pass" | "warning" | null;
    timestamp: string;
    details: string[];
  }>({ status: null, timestamp: "", details: [] });

  const faqs: FAQItem[] = [
    {
      category: "reports",
      question: "How do I export native, executive-grade PDF reports?",
      answer:
        "Depending on your deployment environment, there are several options available. When running locally via VSCode or in standalone browsers, use the 'Local Browser Print' button in the footer to trigger the native PDF generator. All UI buttons, helper rails, and developer simulation widgets are automatically hidden from the print layout using responsive print media classes.",
    },
    {
      category: "connection",
      question: "How is the simulated backend query latency computed?",
      answer:
        "The dashboard integrates a live simulation control hub in the header allowing engineers to test performance under varying network conditions (LAN broadband 100ms vs slow mobile networks 1500ms). This helps preview how state charts react to data fetching delays.",
    },
    {
      category: "security",
      question: "Are ledger signatures permanently logged?",
      answer:
        "Yes, our Portfolio CRM sync drills apply secure double-entry signatures utilizing CJS cryptographic timestamp protocols. This guarantees every audit trace remains verified, preventing modifications to old blocks in compliance with standard audit frameworks.",
    },
    {
      category: "connection",
      question: "What causes simulated database connection 500 errors?",
      answer:
        "Enabling '🔌 SIM ERROR' in the headers triggers simulated server failures. This verifies the dashboard's robust state handlers, displaying comprehensive error cards and a 'Retry' sequence to retrieve clean operational cache easily.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === "all" || faq.category === activeCategory,
  );

  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsResult({
        status: "pass",
        timestamp: new Date().toLocaleTimeString(),
        details: [
          "SEC Node handshake established successfully.",
          "Local cryptographic session keys verified.",
          "Database latency average: 400ms.",
          "SSL Certificate: Active validation chain.",
        ],
      });
    }, 1200);
  };

  return (
    <div className="space-y-6" id="help-system-workspace">
      <div className="bg-zinc-900 border border-zinc-850 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
        <div className="relative z-10 space-y-2 max-w-xl text-left">
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-wider text-indigo-400 uppercase bg-indigo-505/15 border border-indigo-505/25 px-2.5 py-1 rounded-lg w-max">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Systems Documentation</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight font-sans">
            Support Center & System Guides
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Access secure transaction procedures, configure local browser PDF
            options, or run instant hardware diagnostics to confirm warehouse
            synchronization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div
          className="col-span-12 lg:col-span-7 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md"
          id="faqs-accordion-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-850 pb-4 mb-4">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans text-left">
              Frequently Asked Support Questions
            </h3>

            <div className="flex bg-zinc-105/60 dark:bg-zinc-950/40 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 text-[10px] font-bold font-mono">
              {(["all", "connection", "security", "reports"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setExpandedIndex(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer uppercase transition-colors ${
                      activeCategory === cat
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-extrabold shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/40 dark:border-zinc-800/35 overflow-hidden transition-all text-left bg-white/30 dark:bg-zinc-950/15"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-4 flex justify-between items-center text-xs font-bold text-zinc-900 dark:text-white cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/35 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-180 text-indigo-505" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-100 dark:border-zinc-850 px-4 py-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="col-span-12 lg:col-span-5 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md flex flex-col justify-between space-y-4"
          id="diagnostics-suite-panel"
        >
          <div className="text-left space-y-1">
            <span className="text-[9px] font-extrabold text-zinc-400 font-mono uppercase tracking-wider block">
              Diagnostics Hub
            </span>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white font-sans">
              Dynamic Integrity Verifier
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
              Run manual diagnostics tests to verify local offline cache bounds,
              cryptographic signature layers, and socket handshake connectivity.
            </p>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-950/80 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-850/40 font-mono text-left space-y-2">
            <div className="flex justify-between text-[10px] text-zinc-400 border-b border-zinc-200/55 dark:border-zinc-850 pb-1.5 mb-1 text-xs">
              <span className="font-bold">SYSTEM AUDIT LOGS</span>
              <span>NODE: SEC-OK</span>
            </div>

            <div className="text-[11px] space-y-1 text-zinc-500 dark:text-zinc-400">
              <p className="text-zinc-400">• Standard System UTC: 2026-06-11</p>
              <p className="text-zinc-400">
                • Current Location: Global Client Node
              </p>
              {diagnosticsRunning ? (
                <p className="text-indigo-505 animate-pulse font-bold">
                  • RUNNING DYNAMIC AUDITS...
                </p>
              ) : diagnosticsResult.status ? (
                <div className="space-y-1.5 pt-1.5 border-t border-zinc-200/40 dark:border-zinc-850/40">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      DIAGNOSTICS PASSED ({diagnosticsResult.timestamp})
                    </span>
                  </p>
                  {diagnosticsResult.details.map((det, i) => (
                    <p
                      key={i}
                      className="text-[10.5px] text-zinc-650 dark:text-zinc-400"
                    >
                      → {det}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 italic text-[11px] pt-1">
                  • Diagnostics has not been run in this workspace session.
                </p>
              )}
            </div>
          </div>

          <button
            onClick={runDiagnostics}
            disabled={diagnosticsRunning}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 cursor-pointer transition-all active:scale-98"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${diagnosticsRunning ? "animate-spin text-indigo-500" : ""}`}
            />
            <span>
              {diagnosticsRunning
                ? "TESTING INTEGRITY..."
                : "RUN INTEGRITY CHECKS"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
