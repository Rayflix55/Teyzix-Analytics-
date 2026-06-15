import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Mock data functions
function getBaseDashboardData() {
  return {
    success: true,
    data: {
      revenue: 12368,
      orders: 355,
      customers: 8250,
      marketShare: { fashion: 64, electronics: 32, foods: 16 },
      revenueTrend: { july: 4100, october: 4800 }
    }
  };
}

function emptyDashboardData() {
  return {
    success: true,
    data: {
      revenue: 0,
      orders: 0,
      customers: 0,
      marketShare: { fashion: 0, electronics: 0, foods: 0 },
      revenueTrend: {}
    }
  };
}

app.get('/api/dashboard-data', async (req, res) => {
  try {
    const triggerError = req.query.error === 'true';
    const requestEmpty = req.query.empty === 'true';

    if (triggerError) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }

    if (requestEmpty) {
      return res.json(emptyDashboardData());
    }

    return res.json(getBaseDashboardData());
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Unknown error',
    });
  }
});

app.post('/api/copilot', async (req, res) => {
  try {
    const { message, isEmpty = false } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // Fallback response (works without Gemini API key)
    const fallbackText = `### 📊 Teyzix Analytics Response

**Your question:** "${message}"

**Current Metrics:**
- **Daily Revenue**: $12,368
- **Active Orders**: 355
- **Customer Base**: 8,250 (Emirates region)
- **Top Category**: Fashion (64% market share)

*Note: Full AI features available with Gemini API configuration.*`;

    // Try to use Gemini if API key is available
    try {
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: message,
      });
      const replyText = response.text || fallbackText;
      return res.json({ success: true, text: replyText });
    } catch (apiError) {
      // Fallback to local response
      return res.json({ success: true, text: fallbackText });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Copilot error: ' + err.message });
  }
});

export default app;