import dotenv from 'dotenv';

dotenv.config();

const getBaseDashboardData = () => ({
  kpis: {
    revenue: {
      id: 'revenue',
      title: 'Total Revenue',
      value: '$12.4k',
      countLabel: 'Monthly',
      subValue: '+14.8%',
      icon: 'trending-up',
      trend: 'up',
    },
    assessment: {
      id: 'assessment',
      title: 'Business Score',
      value: 'A+',
      countLabel: 'Rating',
      subValue: 'Stable',
      icon: 'shield-check',
      trend: 'neutral',
    },
    orders: {
      id: 'orders',
      title: 'Purchase Orders',
      value: '355',
      countLabel: 'This month',
      subValue: '3.2% above target',
      icon: 'shopping-bag',
      trend: 'up',
    },
    connection: {
      id: 'connection',
      title: 'System Connection',
      value: '99.9%',
      countLabel: 'Uptime',
      subValue: 'Secure',
      icon: 'server',
      trend: 'up',
    },
  },
  revenueTrend: [
    { month: 'Jan', revenue: 3200, target: 3100 },
    { month: 'Feb', revenue: 4100, target: 3800 },
    { month: 'Mar', revenue: 3850, target: 4000 },
    { month: 'Apr', revenue: 4700, target: 4500 },
    { month: 'May', revenue: 5200, target: 5000 },
  ],
  salesComparison: [
    { region: 'North America', min: 1200, max: 5200, average: 3400 },
    { region: 'Europe', min: 950, max: 4300, average: 2750 },
    { region: 'Asia Pacific', min: 800, max: 3800, average: 2400 },
  ],
  categoryDistribution: [
    { category: 'Fashion', percentage: 43, color: '#6366F1', revenue: 5280 },
    { category: 'Electronics', percentage: 33, color: '#14B8A6', revenue: 4030 },
    { category: 'Foods', percentage: 24, color: '#F97316', revenue: 2940 },
  ],
  customerGrowth: [
    { location: 'North America', value: 12, percentage: 12, color: '#22C55E' },
    { location: 'Europe', value: 9, percentage: 9, color: '#38BDF8' },
    { location: 'Asia Pacific', value: 16, percentage: 16, color: '#A855F7' },
  ],
  weeklyRevenue: [
    { day: 'Mon', revenue: 780, target: 740 },
    { day: 'Tue', revenue: 860, target: 800 },
    { day: 'Wed', revenue: 920, target: 880 },
    { day: 'Thu', revenue: 1030, target: 950 },
    { day: 'Fri', revenue: 1130, target: 1080 },
    { day: 'Sat', revenue: 980, target: 930 },
    { day: 'Sun', revenue: 870, target: 840 },
  ],
  recentTransactions: [
    {
      id: 'TX1001',
      name: 'Apex Retail Group',
      revenue: 1220,
      orders: 34,
      status: 'Active',
      region: 'North America',
      date: '2026-05-28',
      avatar: 'AR',
    },
    {
      id: 'TX1002',
      name: 'Orion Electronics',
      revenue: 980,
      orders: 27,
      status: 'Pending',
      region: 'Europe',
      date: '2026-05-29',
      avatar: 'OE',
    },
    {
      id: 'TX1003',
      name: 'Helix Logistics',
      revenue: 760,
      orders: 19,
      status: 'Active',
      region: 'Asia Pacific',
      date: '2026-05-30',
      avatar: 'HL',
    },
  ],
});

const emptyDashboardData = () => ({
  kpis: {
    revenue: {
      id: 'revenue',
      title: 'Total Revenue',
      value: '$0',
      countLabel: 'Monthly',
      subValue: 'No activity',
      icon: 'trending-up',
      trend: 'neutral',
    },
    assessment: {
      id: 'assessment',
      title: 'Business Score',
      value: 'N/A',
      countLabel: 'Rating',
      subValue: 'No data',
      icon: 'shield-check',
      trend: 'neutral',
    },
    orders: {
      id: 'orders',
      title: 'Purchase Orders',
      value: '0',
      countLabel: 'This month',
      subValue: 'No orders',
      icon: 'shopping-bag',
      trend: 'neutral',
    },
    connection: {
      id: 'connection',
      title: 'System Connection',
      value: '100%',
      countLabel: 'Uptime',
      subValue: 'Stable',
      icon: 'server',
      trend: 'up',
    },
  },
  revenueTrend: [],
  salesComparison: [],
  categoryDistribution: [],
  customerGrowth: [],
  weeklyRevenue: [],
  recentTransactions: [],
});

const handleDashboardData = (query: Record<string, any> | undefined) => {
  const requestEmpty = query?.empty === 'true';
  if (requestEmpty) {
    return emptyDashboardData();
  }
  return getBaseDashboardData();
};

const handleCopilot = async (body: any) => {
  const message = body?.message || '';
  const fallback = `### Analytics Response\n\nYou asked: "${message}"\n\nCurrent metrics: Revenue $12,368, Orders 355.`;
  return { success: true, text: fallback };
};

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const payload = handleDashboardData(req.query);
      return res.status(200).json(payload);
    }

    if (req.method === 'POST') {
      const body =
        req.body && Object.keys(req.body).length > 0
          ? req.body
          : await parseJsonBody(req);
      const payload = await handleCopilot(body);
      return res.status(200).json(payload);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

async function parseJsonBody(req: any) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}
