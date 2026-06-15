import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Simple mock data (no external file dependencies)
const getBaseDashboardData = () => ({
  success: true,
  data: {
    revenue: 12368,
    orders: 355,
    customers: 8250,
    marketShare: { fashion: 64, electronics: 32, foods: 16 },
    revenueTrend: { july: 4100, october: 4800 }
  }
});

const emptyDashboardData = () => ({
  success: true,
  data: {
    revenue: 0,
    orders: 0,
    customers: 0,
    marketShare: { fashion: 0, electronics: 0, foods: 0 },
    revenueTrend: {}
  }
});

app.get('/api/dashboard-data', (req, res) => {
  const requestEmpty = req.query.empty === 'true';
  if (requestEmpty) {
    return res.json(emptyDashboardData());
  }
  return res.json(getBaseDashboardData());
});

app.post('/api/copilot', (req, res) => {
  const { message } = req.body;
  const fallback = `### Analytics Response\n\nYou asked: "${message}"\n\nCurrent metrics: Revenue $12,368, Orders 355.`;
  return res.json({ success: true, text: fallback });
});

export default app;