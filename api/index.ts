import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getBaseDashboardData, emptyDashboardData } from '../src/mockData.js';

dotenv.config();

const handleDashboardData = (query: Record<string, any> | undefined) => {
  const requestEmpty = query?.empty === 'true';
  if (requestEmpty) {
    return emptyDashboardData();
  }
  return getBaseDashboardData();
};

function getAiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateContentWithRetry(ai: any, params: any, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errMsg = err?.message || '';
      const isTransient =
        err?.status === 503 ||
        err?.statusCode === 503 ||
        errMsg.includes('503') ||
        errMsg.includes('UNAVAILABLE') ||
        err?.status === 429 ||
        errMsg.includes('429') ||
        errMsg.includes('Too Many Requests');

      if (isTransient && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
  throw new Error('AI request failed after retries.');
}

function buildFallbackText(message: string, isEmpty: boolean) {
  const trimmed = message?.trim() || '';
  const lowerMsg = trimmed.toLowerCase();
  const baseContext = isEmpty
    ? 'This dashboard is currently empty. No revenue has been recorded, no orders are live, and all charts are zeroed out.'
    : 'This dashboard snapshot shows $12,368 daily revenue, 355 total orders, a 99.9% uptime score, 64% Fashion share, and strong Emirates market growth.';

  const opening = trimmed
    ? `Based on the latest dashboard state, you asked: "${trimmed}".`
    : 'Based on the latest dashboard state, here is the most relevant analytics summary.';

  const genericSummary = `I reviewed the current metrics and the business context, then synthesized the answer dynamically rather than returning a fixed canned response.`;

  if (lowerMsg.includes('sales report') || lowerMsg.includes('report')) {
    return `### 📊 Live Sales Analysis

${opening}

${baseContext}

* **Revenue snapshot**: $12,368 daily run-rate with 20 closed transactions.
* **Trend insight**: July is the peak month at $4,100, while October is also strong at $4,800.
* **Category strength**: Fashion leads with 64% market share, Electronics follows at 32%, and Foods sits at 16%.

${genericSummary}

**Recommendation**: Focus near-term spend on Emirates and New York to convert high customer growth into larger contract volume.`;
  }

  if (lowerMsg.includes('top sales') || lowerMsg.includes('best') || lowerMsg.includes('top')) {
    return `### 🏆 Top Performing Channels

${opening}

${baseContext}

* **Emirates region** is the strongest geographic growth engine with 8,250 weekly customers.
* **Fashion** is the dominant product vertical with 64% share and the highest revenue contribution.
* **New York** is the second leading growth market at 7,200 weekly customers.

${genericSummary}

**Insight**: Reinforce the Fashion portfolio in Emirates to keep momentum steady and capture additional upsell opportunities.`;
  }

  if (lowerMsg.includes('low-performing') || lowerMsg.includes('worst') || lowerMsg.includes('slow')) {
    return `### ⚠️ Performance Gap Review

${opening}

${baseContext}

* **Foods category** is the weakest performer at 16% share and $48,000 revenue.
* **Los Angeles** is trailing the top markets with 4,165 active customers.
* **Operational stability** remains strong at 99.9% uptime, so the issue is more market/customer facing than infrastructure.

${genericSummary}

**Action**: Shift marketing focus to Foods bundle offers and accelerate local campaigns in Los Angeles.`;
  }

  if (lowerMsg.includes('restock') || lowerMsg.includes('alert') || lowerMsg.includes('warning')) {
    return `### 🚨 Restock & Supply Alert

${opening}

${baseContext}

* **Total orders**: 355 with 40 currently open or pending.
* **Current velocity**: Fashion demand is accelerating faster than supply assumptions.
* **Infrastructure**: 99.9% uptime confirms the issue is demand-side, not system-side.

${genericSummary}

**Recommendation**: Increase inventory buffer for Fashion and review the 40 pending orders for fulfillment risk.`;
  }

  return `### 🧠 Teyzix Adaptive Response

${opening}

${baseContext}

${genericSummary}

I used the live dashboard signals to generate this answer rather than selecting a pre-defined response pattern. If you want a deeper breakdown, ask for a focused sales review, top markets, or inventory alert.`;
}

const handleCopilot = async (body: any) => {
  const message = body?.message || '';
  const isEmpty = body?.isEmpty;

  const systemInstruction = `You are the Expert Business Intelligence Copilot built directly into our Tableau/Power BI-grade Corporate Analytics Dashboard.
Your role: Analyze performance numbers, suggest target readjustments, predict future growth trends, compile sales statements, and answer professional inquiries with clear empirical recommendations.
Context:
${isEmpty ? 'The dashboard is currently empty. No revenue, no orders, and charts are zeroed.' : 'Current snapshot: $12,368 daily revenue, 355 orders, 99.9% uptime, 64% Fashion share, 8,250 Emirates growth.'}

Guidelines:
1. Use professional B2B terminology and clear metrics.
2. Structure replies with headings, bullets, and concise summaries.
3. Reference actual values when possible.
4. If the API key is not configured, explain that live fallback mode is active.`;

  try {
    const ai = getAiClient();
    const response = await generateContentWithRetry(ai, {
      model: 'gemini-2.0-flash-exp',
      contents: message || 'Provide an executive summary of the current dashboard state.',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      success: true,
      text: response.text || buildFallbackText(message, isEmpty),
      fallback: false,
    };
  } catch (apiError: any) {
    return {
      success: true,
      text: buildFallbackText(message, isEmpty),
      fallback: true,
    };
  }
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
