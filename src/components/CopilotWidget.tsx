/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from "react";
import {
  Send,
  FileText,
  Sparkles,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";

function formatMarkdownText(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("###")) {
      return (
        <h4
          key={idx}
          className="text-sm font-bold text-zinc-900 dark:text-white mt-3 mb-1.5 font-sans border-b border-zinc-200/40 pb-0.5"
        >
          {line.replace("###", "").trim()}
        </h4>
      );
    }

    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <strong
          key={idx}
          className="block text-xs font-bold text-zinc-850 dark:text-zinc-205 mt-2 mb-1"
        >
          {line.replace(/\*\*/g, "").trim()}
        </strong>
      );
    }

    if (line.startsWith("*") || line.startsWith("-")) {
      const bulletContent = line.replace(/^[\*\-]\s*/, "");
      return (
        <div key={idx} className="flex items-start gap-1.5 my-1 text-xs pl-1">
          <span className="text-indigo-505 dark:text-indigo-405 font-bold mt-0.5">
            •
          </span>
          <span className="text-zinc-650 dark:text-zinc-350 leading-relaxed">
            {formatBoldSegments(bulletContent)}
          </span>
        </div>
      );
    }

    if (line.trim() === "") {
      return <div key={idx} className="h-1.5" />;
    }
    return (
      <p
        key={idx}
        className="text-xs text-zinc-650 dark:text-zinc-355 leading-relaxed my-1"
      >
        {formatBoldSegments(line)}
      </p>
    );
  });
}

function formatBoldSegments(segment: string): React.ReactNode {
  const parts = segment.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return segment;

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong
          key={i}
          className="font-semibold text-zinc-900 dark:text-white font-sans"
        >
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default function CopilotWidget() {
  const {
    language,
    chatHistory,
    isChatLoading,
    isCopilotFallback,
    sendCopilotMessage,
    clearChat,
  } = useDashboardStore();

  const t = translations[language];
  const [inputVal, setInputVal] = React.useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isChatLoading) return;
    sendCopilotMessage(inputVal);
    setInputVal("");
  };

  const executeQuickPrompt = (prompt: string) => {
    if (isChatLoading) return;
    sendCopilotMessage(prompt);
  };

  const quickPrompts = [
    {
      label: t.salesReport,
      icon: FileText,
      query:
        "Give me a brief summary sales report of our current daily volume.",
    },
    {
      label: t.topSales,
      icon: TrendingUp,
      query: "What are our top sales segments and locations?",
    },
    {
      label: t.lowPerforming,
      icon: HelpCircle,
      query: "Highlight the low-performing products and suggested steps.",
    },
    {
      label: t.restockAlert,
      icon: AlertCircle,
      query: "Show restock alert details and safety recommendations.",
    },
  ];

  return (
    <div
      className="bg-white/95 dark:bg-zinc-900/90 border border-zinc-200/50 dark:border-zinc-800/40 p-4 md:p-5 rounded-3xl backdrop-blur-md shadow-xl flex flex-col justify-between min-h-[380px] xl:min-h-[460px]"
      id="copilot-widget-container"
    >
      {isCopilotFallback && (
        <div className="mb-3 rounded-2xl border border-amber-300/60 bg-amber-50/80 dark:bg-amber-950/10 dark:border-amber-500/30 px-3 py-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
          Live fallback mode is active. The response is generated from current dashboard context rather than a cached answer.
        </div>
      )}
      {/* Widget Header*/}
      <div className="flex justify-between items-center border-b border-zinc-200/40 dark:border-zinc-850/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-yellow-400 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
              {t.copilotTitle}
            </h3>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold uppercase tracking-wider block">
              Teyzix Intelligence Engine
            </span>
          </div>
        </div>

        {/* Clear Thread Option */}
        {chatHistory.length > 1 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            title="Reset Chat Log"
            id="copilot-clear-history-btn"
          >
            <Trash2 className="w-3 h-3" />
            <span>{t.clearChat}</span>
          </button>
        )}
      </div>

      {/* Primary Message Log Viewport */}
      <div className="flex-1 my-3 overflow-y-auto max-h-[220px] xl:max-h-[300px] space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-850">
        {chatHistory.map((msg) => {
          const isModel = msg.role === "model";
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isModel ? "mr-auto items-start" : "ml-auto items-end"}`}
            >
              {/* Message Capsule */}
              <div
                className={`py-2 px-3 rounded-2xl text-xs shadow-sm ${
                  isModel
                    ? "bg-zinc-100/70 dark:bg-zinc-850/60 text-zinc-805 dark:text-zinc-205 border border-zinc-200/20 dark:border-zinc-800/10"
                    : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-medium"
                }`}
              >
                {isModel ? (
                  <div className="space-y-1">
                    {formatMarkdownText(msg.text)}
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
              </div>

              {/* Relative Timestamp */}
              <span className="text-[9px] text-zinc-400/80 font-mono mt-1 px-1 scale-90">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isChatLoading && (
          <div className="mr-auto items-start flex gap-1.5 max-w-[85%]">
            <div className="py-3 px-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-850/50 border border-zinc-200/20 dark:border-zinc-800/10 text-zinc-500 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-505" />
              <span className="animate-pulse">
                {t.loadingText.split("...")[0]}...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Dynamic Action Chips  */}
      <div className="mb-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-850/30">
        <div className="grid grid-cols-2 gap-1.5">
          {quickPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => executeQuickPrompt(p.query)}
                className="flex items-center gap-1.5 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40 text-left bg-[#fbfbfb]/80 dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                id={`copilot-prompt-chip-${idx}`}
              >
                <Icon className="w-3.5 h-3.5 text-indigo-505 flex-shrink-0" />
                <span className="truncate">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form Footer */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t.askSomething}
          disabled={isChatLoading}
          className="flex-1 text-xs border border-zinc-200/60 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950/40 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300 rounded-xl px-3 py-2 text-zinc-855 dark:text-zinc-155 placeholder-zinc-400 outline-none"
          id="copilot-input-field"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isChatLoading}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md ${
            !inputVal.trim() || isChatLoading
              ? "opacity-40 cursor-not-allowed"
              : "hover:scale-105 hover:bg-zinc-900 dark:hover:bg-zinc-100 cursor-pointer"
          }`}
          id="copilot-send-button"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
