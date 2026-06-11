/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CustomerStatus = "Active" | "Pending" | "Inactive";

export type Region =
  | "North America"
  | "Europe"
  | "Asia Pacific"
  | "Middle East"
  | "South America";

export interface CustomerTransaction {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  status: CustomerStatus;
  region: Region;
  date: string;
  avatar: string;
}

export interface KpiCardData {
  id: string;
  title: string;
  value: string;
  countLabel: string;
  subValue: string;
  icon: string;
  trend: "up" | "down" | "neutral";
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
  target: number;
}

export interface SalesComparisonPoint {
  region: string;
  min: number;
  max: number;
  average: number;
}

export interface CategoryDistributionItem {
  category: string;
  percentage: number;
  color: string;
  revenue: number;
}

export interface CustomerGrowthPoint {
  location: string;
  value: number;
  percentage: number;
  color: string;
}

export interface WeeklyRevenuePoint {
  day: string;
  revenue: number;
  target: number;
}

export interface DashboardData {
  kpis: {
    revenue: KpiCardData;
    assessment: KpiCardData;
    orders: KpiCardData;
    connection: KpiCardData;
  };
  revenueTrend: RevenueTrendPoint[];
  salesComparison: SalesComparisonPoint[];
  categoryDistribution: CategoryDistributionItem[];
  customerGrowth: CustomerGrowthPoint[];
  weeklyRevenue: WeeklyRevenuePoint[];
  recentTransactions: CustomerTransaction[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
