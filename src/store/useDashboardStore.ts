/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import {
  DashboardData,
  ChatMessage,
  Region,
  CustomerStatus,
} from "../types/dashboard";

interface DashboardState {
  theme: "light" | "dark";
  language: "en" | "de" | "fr" | "es";
  isLoading: boolean;
  error: string | null;
  data: DashboardData | null;

  activeTab:
    | "overview"
    | "analytics"
    | "companies"
    | "accounts"
    | "help"
    | "profile";

  selectedCompanyForAnalytics: string | null;

  selectedCompanyInfoId: string | null;

  isSimulatedEmpty: boolean;
  isSimulatedError: boolean;
  simulatedDelay: number; // in ms

  searchQuery: string;
  selectedRegion: "All" | Region;
  selectedStatus: "All" | CustomerStatus;
  revenueRange: [number, number]; // [min, max]
  currentPage: number;
  pageSize: number;
  sortBy: "name" | "revenue" | "orders" | "status" | "region";
  sortOrder: "asc" | "desc";

  chatHistory: ChatMessage[];
  isChatLoading: boolean;

  toggleTheme: () => void;
  setLanguage: (lang: "en" | "de" | "fr" | "es") => void;
  setActiveTab: (
    tab:
      | "overview"
      | "analytics"
      | "companies"
      | "accounts"
      | "help"
      | "profile",
  ) => void;
  setSelectedCompanyForAnalytics: (id: string | null) => void;
  setSelectedCompanyInfoId: (id: string | null) => void;
  setSimulatedEmpty: (empty: boolean) => void;
  setSimulatedError: (err: boolean) => void;
  setSimulatedDelay: (delay: number) => void;

  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: "All" | Region) => void;
  setSelectedStatus: (status: "All" | CustomerStatus) => void;
  setRevenueRange: (range: [number, number]) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (field: "name" | "revenue" | "orders" | "status" | "region") => void;
  resetFilters: () => void;

  fetchData: () => Promise<void>;
  sendCopilotMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  theme:
    (localStorage.getItem("bi-dashboard-theme") as "light" | "dark") || "light",
  language:
    (localStorage.getItem("bi-dashboard-lang") as "en" | "de" | "fr" | "es") ||
    "en",
  isLoading: false,
  error: null,
  data: null,
  activeTab: "overview",
  selectedCompanyForAnalytics: null,
  selectedCompanyInfoId: null,

  isSimulatedEmpty: false,
  isSimulatedError: false,
  simulatedDelay: 400, // standard UX responsive buffer

  searchQuery: "",
  selectedRegion: "All",
  selectedStatus: "All",
  revenueRange: [0, 30000],
  currentPage: 1,
  pageSize: 6,
  sortBy: "revenue",
  sortOrder: "desc",

  chatHistory: [
    {
      id: "welcome",
      role: "model",
      text: "Hi Jonathon SR, welcome back to the company dashboard! Can I help you with high-level sales audits, top performers, low-velocity stocks, or automated restocking parameters today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ],
  isChatLoading: false,

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    localStorage.setItem("bi-dashboard-theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme: nextTheme });
  },

  setLanguage: (lang) => {
    localStorage.setItem("bi-dashboard-lang", lang);
    set({ language: lang });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setSelectedCompanyForAnalytics: (id) => {
    set({ selectedCompanyForAnalytics: id });
  },

  setSelectedCompanyInfoId: (id) => {
    set({ selectedCompanyInfoId: id });
  },

  setSimulatedEmpty: (empty) => {
    set({ isSimulatedEmpty: empty, currentPage: 1 });
    get().fetchData();
  },
  setSimulatedError: (err) => {
    set({ isSimulatedError: err });
    get().fetchData();
  },
  setSimulatedDelay: (delay) => set({ simulatedDelay: delay }),

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedRegion: (region) =>
    set({ selectedRegion: region, currentPage: 1 }),
  setSelectedStatus: (status) =>
    set({ selectedStatus: status, currentPage: 1 }),
  setRevenueRange: (range) => set({ revenueRange: range, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  setSort: (field) => {
    const currentSort = get().sortBy;
    const currentOrder = get().sortOrder;
    if (currentSort === field) {
      set({ sortOrder: currentOrder === "asc" ? "desc" : "asc" });
    } else {
      set({ sortBy: field, sortOrder: "desc" });
    }
  },

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedRegion: "All",
      selectedStatus: "All",
      revenueRange: [0, 30000],
      currentPage: 1,
    }),

  fetchData: async () => {
    set({ isLoading: true, error: null });
    const { isSimulatedEmpty, isSimulatedError, simulatedDelay } = get();

    try {
      const url = `/api/dashboard-data?delay=${simulatedDelay}&error=${isSimulatedError}&empty=${isSimulatedEmpty}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(
          errorDetails.message ||
            "Error occurred while loading analytics records.",
        );
      }

      const dashboardPayload = await res.json();
      set({ data: dashboardPayload, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, data: null });
    }
  },

  sendCopilotMessage: async (text) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, userMsg],
      isChatLoading: true,
    }));

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: get().chatHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          isEmpty: get().isSimulatedEmpty,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Our company server encountered issues answering your inquiry.",
        );
      }

      const reply = await response.json();

      const copilotMsg: ChatMessage = {
        id: `cpl-${Date.now()}`,
        role: "model",
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      set((state) => ({
        chatHistory: [...state.chatHistory, copilotMsg],
        isChatLoading: false,
      }));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `⚠️ **System Incident Alert**: ${err.message || "Failed to sync with the intelligence node. Please verify credentials under settings."}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      set((state) => ({
        chatHistory: [...state.chatHistory, errorMsg],
        isChatLoading: false,
      }));
    }
  },

  clearChat: () => {
    set({
      chatHistory: [
        {
          id: "welcome",
          role: "model",
          text: "Let's start a fresh session! What business metrics or trend patterns would you like to review?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    });
  },
}));
