/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardData, CustomerTransaction } from './types/dashboard';

export const getMockTransactions = (): CustomerTransaction[] => [
  { id: 'TX-1001', name: 'Jonathan Carter', revenue: 15420, orders: 12, status: 'Active', region: 'North America', date: '2026-06-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80' },
  { id: 'TX-1002', name: 'Sophia Smith', revenue: 9840, orders: 8, status: 'Active', region: 'Europe', date: '2026-06-03', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80' },
  { id: 'TX-1003', name: 'Hiroshi Tanaka', revenue: 24150, orders: 18, status: 'Active', region: 'Asia Pacific', date: '2026-06-04', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80' },
  { id: 'TX-1004', name: 'Fatima Al-Sayed', revenue: 18250, orders: 14, status: 'Pending', region: 'Middle East', date: '2026-06-05', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&fit=crop&q=80' },
  { id: 'TX-1005', name: 'Carlos Gomez', revenue: 8310, orders: 6, status: 'Inactive', region: 'South America', date: '2026-05-28', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80' },
  { id: 'TX-1006', name: 'Emma Watson', revenue: 14200, orders: 11, status: 'Active', region: 'Europe', date: '2026-06-02', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop&q=80' },
  { id: 'TX-1007', name: 'Lucas Silva', revenue: 12500, orders: 9, status: 'Active', region: 'South America', date: '2026-06-06', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&fit=crop&q=80' },
  { id: 'TX-1008', name: 'Amara Okafor', revenue: 21600, orders: 16, status: 'Active', region: 'Middle East', date: '2026-06-07', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&fit=crop&q=80' },
  { id: 'TX-1009', name: 'David Miller', revenue: 6400, orders: 4, status: 'Pending', region: 'North America', date: '2026-06-08', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&fit=crop&q=80' },
  { id: 'TX-1010', name: 'Zoe Chen', revenue: 17800, orders: 13, status: 'Active', region: 'Asia Pacific', date: '2026-06-09', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop&q=80' },
  { id: 'TX-1011', name: 'Robert Vance', revenue: 11300, orders: 7, status: 'Inactive', region: 'North America', date: '2026-05-25', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop&q=80' },
  { id: 'TX-1012', name: 'Elena Rostova', revenue: 15900, orders: 12, status: 'Active', region: 'Europe', date: '2026-06-10', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&q=80' }
];

export const getBaseDashboardData = (): DashboardData => ({
  kpis: {
    revenue: {
      id: 'kpi-revenue',
      title: 'Earnings /day',
      value: '$12,368',
      countLabel: '20 Closed',
      subValue: '+14.2%',
      trend: 'up',
      icon: 'DollarSign'
    },
    assessment: {
      id: 'kpi-assessment',
      title: 'Assessment',
      value: '45',
      countLabel: '4.5 Rating',
      subValue: 'Excellent',
      trend: 'neutral',
      icon: 'Activity'
    },
    orders: {
      id: 'kpi-orders',
      title: 'Orders',
      value: '355',
      countLabel: '40 Open',
      subValue: '+8.3%',
      trend: 'up',
      icon: 'ShoppingBag'
    },
    connection: {
      id: 'kpi-connection',
      title: 'Connection',
      value: '87',
      countLabel: '20 Active',
      subValue: '99.9% uptime',
      trend: 'up',
      icon: 'Zap'
    }
  },
  revenueTrend: [
    { month: 'Jan', revenue: 2000, target: 2800 },
    { month: 'Feb', revenue: 2000, target: 2800 },
    { month: 'Mar', revenue: 1400, target: 2200 },
    { month: 'Apr', revenue: 2800, target: 1800 },
    { month: 'May', revenue: 2800, target: 1800 },
    { month: 'Jun', revenue: 3200, target: 1800 },
    { month: 'Jul', revenue: 4100, target: 2500 },
    { month: 'Aug', revenue: 3200, target: 2500 },
    { month: 'Sep', revenue: 3200, target: 2800 },
    { month: 'Oct', revenue: 4800, target: 2800 }
  ],
  salesComparison: [
    { region: 'TX', min: 1500, max: 4000, average: 2900 },
    { region: 'CA', min: 1000, max: 3000, average: 2100 },
    { region: 'NY', min: 2000, max: 4500, average: 3400 },
    { region: 'ND', min: 1200, max: 3800, average: 2600 }
  ],
  categoryDistribution: [
    { category: 'Fashion', percentage: 64, color: '#f3c623', revenue: 192000 },
    { category: 'Electronics', percentage: 32, color: '#6366f1', revenue: 96000 },
    { category: 'Foods', percentage: 16, color: '#f97316', revenue: 48000 }
  ],
  customerGrowth: [
    { location: 'Emirates', value: 8250, percentage: 42, color: '#f3c623' },
    { location: 'New York', value: 7200, percentage: 37, color: '#f97316' },
    { location: 'Los Angeles', value: 4165, percentage: 21, color: '#6366f1' }
  ],
  weeklyRevenue: [
    { day: 'S', revenue: 1200, target: 1500 },
    { day: 'M', revenue: 2300, target: 1900 },
    { day: 'T', revenue: 1800, target: 2200 },
    { day: 'W', revenue: 4800, target: 3800 }, // Peak day highlight
    { day: 'T', revenue: 2400, target: 2600 },
    { day: 'F', revenue: 3100, target: 2900 },
    { day: 'S', revenue: 2900, target: 3300 }
  ],
  recentTransactions: getMockTransactions()
});

export const emptyDashboardData = (): DashboardData => ({
  kpis: {
    revenue: { id: 'kpi-revenue', title: 'Earnings /day', value: '$0', countLabel: '0 Closed', subValue: '0%', trend: 'neutral', icon: 'DollarSign' },
    assessment: { id: 'kpi-assessment', title: 'Assessment', value: '0', countLabel: '0 Rating', subValue: 'No Data', trend: 'neutral', icon: 'Activity' },
    orders: { id: 'kpi-orders', title: 'Orders', value: '0', countLabel: '0 Open', subValue: '0%', trend: 'neutral', icon: 'ShoppingBag' },
    connection: { id: 'kpi-connection', title: 'Connection', value: '0', countLabel: '0 Active', subValue: 'Offline', trend: 'down', icon: 'Zap' }
  },
  revenueTrend: [],
  salesComparison: [],
  categoryDistribution: [],
  customerGrowth: [],
  weeklyRevenue: [],
  recentTransactions: []
});
