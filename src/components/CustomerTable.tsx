/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Download,
  MapPin,
  DollarSign,
  Hash,
  Tag,
  X,
  FileText,
  Eye,
  Building,
} from "lucide-react";
import { useDashboardStore } from "../store/useDashboardStore";
import { translations } from "../utils/translations";
import {
  CustomerTransaction,
  CustomerStatus,
  Region,
} from "../types/dashboard";

export default function CustomerTable() {
  const {
    data,
    isLoading,
    language,

    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    selectedStatus,
    setSelectedStatus,
    revenueRange,
    setRevenueRange,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortBy,
    sortOrder,
    setSort,
    resetFilters,
    setSelectedCompanyInfoId,
  } = useDashboardStore();

  const t = translations[language];

  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [maxRevenue, setMaxRevenue] = React.useState(25000);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMaxRevenue(val);
    setRevenueRange([0, val]);
  };

  if (isLoading || !data) {
    return (
      <div
        className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 rounded-3xl animate-pulse min-h-[380px]"
        id="customer-table-skeleton"
      >
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 bg-zinc-200 dark:bg-zinc-805 rounded w-full"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredCustomers = data.recentTransactions.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegion === "All" || customer.region === selectedRegion;

    const matchesStatus =
      selectedStatus === "All" || customer.status === selectedStatus;

    const matchesRevenue =
      customer.revenue >= revenueRange[0] &&
      customer.revenue <= revenueRange[1];

    return matchesSearch && matchesRegion && matchesStatus && matchesRevenue;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let fieldA = a[sortBy];
    let fieldB = b[sortBy];

    if (sortBy === "revenue" || sortBy === "orders") {
      return sortOrder === "asc"
        ? (fieldA as number) - (fieldB as number)
        : (fieldB as number) - (fieldA as number);
    }

    return sortOrder === "asc"
      ? String(fieldA).localeCompare(String(fieldB))
      : String(fieldB).localeCompare(String(fieldA));
  });

  const totalResults = sortedCustomers.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCustomers = sortedCustomers.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) return;

    const headers = [
      "Customer ID",
      "Customer Name",
      "Revenue ($)",
      "Orders Count",
      "Status",
      "Region",
      "Date",
    ];

    const rows = filteredCustomers.map((cust) => [
      cust.id,
      cust.name,
      cust.revenue,
      cust.orders,
      cust.status,
      cust.region,
      cust.date,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Teyzix_Revenue_Report_${selectedRegion}_${new Date().toISOString().substring(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIndicator = (field: typeof sortBy) => {
    if (sortBy !== field)
      return (
        <ChevronDown className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 hover:text-zinc-500" />
      );
    return sortOrder === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-indigo-505 font-bold" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-indigo-505 font-bold" />
    );
  };

  const getStatusStyle = (status: CustomerStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30";
      case "Pending":
        return "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
      case "Inactive":
        return "bg-zinc-100 text-zinc-500 dark:bg-zinc-850 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800";
    }
  };

  return (
    <div
      className="bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/35 p-5 md:p-6 rounded-3xl shadow-sm backdrop-blur-md"
      id="customer-table-container"
    >
      {/* Table Header actions row */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-4"
        id="table-controls-row"
      >
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white font-sans">
            {t.recentTransactions}
          </h2>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold block">
            {filteredCustomers.length} record segments recovered
          </span>
        </div>

        {/* Global actions: Search, csv export & filters toggle */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Text Filter Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchLabel}
              className="w-full text-xs pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/30 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400-safe"
              id="table-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter toggle trigger */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors outline-none cursor-pointer ${
              showAdvancedFilters ||
              selectedRegion !== "All" ||
              selectedStatus !== "All"
                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/35 dark:text-indigo-400 font-bold"
                : "border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/40 text-zinc-650 dark:text-zinc-330 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            id="table-toggle-advanced-filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              {showAdvancedFilters ? t.resetFilters : t.activeFilters}
            </span>
          </button>

          {/* Export currently filtered list to CSV */}
          <button
            onClick={handleExportCSV}
            disabled={filteredCustomers.length === 0}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
              filteredCustomers.length === 0
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
            title="Download table data as standard Microsoft Excel CSV"
            id="table-export-csv-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.csvExport}</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable drawer */}
      {showAdvancedFilters && (
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-zinc-50/70 dark:bg-zinc-950/30 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 shadow-inner"
          id="table-advanced-filters-panel"
        >
          {/* 1. Status Filter selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-505" />
              <span>Filter Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-750 dark:text-zinc-100 focus:ring-0 outline-none"
              id="filter-status-select"
            >
              <option value="All">{t.allStatuses}</option>
              <option value="Active">{t.active}</option>
              <option value="Pending">{t.pending}</option>
              <option value="Inactive">{t.inactive}</option>
            </select>
          </div>

          {/* 2. Region Filter Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-505" />
              <span>{t.filterLocation}</span>
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-750 dark:text-zinc-100 focus:ring-0 outline-none"
              id="filter-region-select"
            >
              <option value="All">{t.allRegions}</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="Middle East">Middle East</option>
              <option value="South America">South America</option>
            </select>
          </div>

          {/* 3. Revenue Range Parameter slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#f3c623]" />
                <span>Max Revenue</span>
              </label>
              <span className="text-[11px] font-bold font-mono text-indigo-505 dark:text-indigo-405">
                ${maxRevenue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              value={maxRevenue}
              onChange={handleRangeChange}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-505"
              id="filter-revenue-range-slider"
            />
            <div className="flex justify-between text-[9px] text-zinc-405 font-mono">
              <span>$1,000</span>
              <span>$30,000 max Cap</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Data Grid Table */}
      <div
        className="overflow-x-auto w-full transition-all"
        id="table-scroll-viewport"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/55 dark:border-zinc-800/40 text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
              <th className="py-3 px-2">ID</th>
              <th
                className="py-3 px-2 cursor-pointer select-none transition-colors hover:text-zinc-900 dark:hover:text-white"
                onClick={() => setSort("name")}
              >
                <div className="flex items-center gap-1">
                  <span>{t.customerName}</span>
                  {renderSortIndicator("name")}
                </div>
              </th>
              <th
                className="py-3 px-2 cursor-pointer select-none transition-colors hover:text-zinc-900 dark:hover:text-white"
                onClick={() => setSort("revenue")}
              >
                <div className="flex items-center gap-1">
                  <span>{t.revenue}</span>
                  {renderSortIndicator("revenue")}
                </div>
              </th>
              <th
                className="py-3 px-2 cursor-pointer select-none transition-colors hover:text-zinc-900 dark:hover:text-white"
                onClick={() => setSort("orders")}
              >
                <div className="flex items-center gap-1">
                  <span>{t.ordersCol}</span>
                  {renderSortIndicator("orders")}
                </div>
              </th>
              <th
                className="py-3 px-2 cursor-pointer select-none transition-colors hover:text-zinc-900 dark:hover:text-white"
                onClick={() => setSort("status")}
              >
                <div className="flex items-center gap-1">
                  <span>{t.status}</span>
                  {renderSortIndicator("status")}
                </div>
              </th>
              <th
                className="py-3 px-2 cursor-pointer select-none transition-colors hover:text-zinc-900 dark:hover:text-white"
                onClick={() => setSort("region")}
              >
                <div className="flex items-center gap-1">
                  <span>{t.region}</span>
                  {renderSortIndicator("region")}
                </div>
              </th>
              <th className="py-3 px-2 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/20 text-xs">
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCompanyInfoId(cust.id)}
                  className="hover:bg-zinc-55 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 transition-all group cursor-pointer"
                  id={`table-row-${cust.id}`}
                  title="Click to view full corporate company info"
                >
                  <td className="py-3.5 px-2 font-mono font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-505 transition-colors text-[11px]">
                    {cust.id}
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 dark:text-white font-sans group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {cust.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                          <Eye className="w-2.5 h-2.5 text-zinc-400 inline" />{" "}
                          View Entity Details
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 font-bold font-mono text-zinc-950 dark:text-white">
                    ${cust.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-2 font-semibold font-mono text-zinc-600 dark:text-zinc-400">
                    {cust.orders}
                  </td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(cust.status)}`}
                    >
                      {cust.status === "Active" && t.active}
                      {cust.status === "Pending" && t.pending}
                      {cust.status === "Inactive" && t.inactive}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 font-sans font-medium text-zinc-505 dark:text-zinc-405">
                    {cust.region}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono text-zinc-400 text-[11px]">
                    {cust.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-zinc-400 font-mono"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span>💡 {t.emptyText}</span>
                    {(searchQuery ||
                      selectedRegion !== "All" ||
                      selectedStatus !== "All") && (
                      <button
                        onClick={resetFilters}
                        className="text-xs font-bold text-indigo-505 dark:text-indigo-405 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
                        id="table-reset-filters-inline-btn"
                      >
                        Reset All Applied Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Standard Table Pagination controls */}
      {paginatedCustomers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/55 dark:border-zinc-800/40 pt-4 mt-2">
          {/* Summary status text */}
          <span className="text-[10px] font-bold font-mono text-zinc-400">
            {t.region}: {selectedRegion} | showing {startIndex + 1}-
            {Math.min(startIndex + pageSize, totalResults)} {t.of}{" "}
            {totalResults} {t.results}
          </span>

          {/* Quick page switchers */}
          <div
            className="flex items-center gap-1.5"
            id="pagination-controls-box"
          >
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              id="pagination-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Render numeric capsules */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 text-xs rounded-lg flex items-center justify-center font-bold font-mono transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-smScale"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-zinc-505 hover:text-zinc-900 dark:hover:text-white transition-all ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              id="pagination-next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
