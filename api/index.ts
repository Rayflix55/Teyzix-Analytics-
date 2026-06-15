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

const handleCopilot = async (body: any) => {
  const message = body?.message || '';
  const isEmpty = body?.isEmpty;

  const dataContext = isEmpty
    ? 'The dashboard is CURRENTLY EMPTY (Simulated EMPTY state). No revenue has been recorded, 0 orders placed, and standard tracking charts are zeroed.'
    : `
    Here is the live company performance snapshot:
    - Current daily earnings: $12,368 (+14.2% daily trend, 20 closed transactions)
    - Sales assessment index: 45 / 5.0 (Excellent rating)
    - Current Orders volume: 355 orders total (including 40 open or pending shipments)
    - Operational Infrastructure uptime: 99.9%, with 87 ongoing nodes, 20 active modules

    Category market share & demand percentages:
    - Fashion: 64% demand ($192,000 revenue stream)
    - Electronics: 32% demand ($96,000 revenue stream)
    - Foods: 16% demand ($48,000 revenue stream)

    Geographical customer base growth stats:
    - Emirates region: 8,250 weekly customers (active segment)
    - New York metro: 7,200 weekly customers
    - Los Angeles metro: 4,165 weekly customers

    Revenue Trends and target points (monthly):
    - Peak performance month is July ($4,100 actual revenue vs. $2,500 target), and October has surged to $4,800.
    `;

  const systemInstruction = `You are the Expert Business Intelligence Copilot built directly into our Tableau/Power BI-grade Corporate Analytics Dashboard.
Your role: Analyzes performance numbers, suggests target readjustments, predicts future growth trends, compiles sales statements, and addresses professional inquiries with clear, empirical recommendations.
Context:
${dataContext}

Guidelines:
1. Focus entirely on professional B2B terminology, clear metrics, and logical inferences.
2. Structure your replies neatly using bold headings, concise bullet points, and scannable summaries. Avoid long paragraphs of text.
3. Be helpful, strategic, and concise. Reference exact values (e.g., $12,368, 64% Fashion share, 99.9% uptime, etc.) to show domain understanding.
4. If asked about "Sales report", provide a beautiful high-level synthesis of current sales.
5. If asked about "Top Sales", summarize our top markets (Emirates: 8,250, New York: 7,200) and our dominant category (Fashion with 64%).
6. If asked about "Low-performing products", analyze Foods (at 16% share, $48k) and describe action points.
7. If asked about "Restock alert", caution that active orders stand at 355 with 40 currently open, suggesting inventory safety guidelines.
8. If the API key is not configured, explain that we'll operate in intelligent offline analysis fallback mode.`;

  try {
    const ai = getAiClient();
    const response = await generateContentWithRetry(ai, {
      model: 'gemini-2.0-flash-exp',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      success: true,
      text: response.text || 'I was unable to formulate a response at this time. Please check your data connectors.',
    };
  } catch (apiError: any) {
    const lowerMsg = message.toLowerCase();
    let fallbackText = '';

    if (lowerMsg.includes('sales report') || lowerMsg.includes('report')) {
      fallbackText = `### 📊 Live Executive Sales Report

Our enterprise performance remains incredibly strong, led by significant momentum across multiple segments:

* **Daily Net Volume**: **$12,368** daily net run-rate with **20 corporate accounts closed** and finalized.
* **Monthly Peak Trends**: Excellent tracking in our **July peak cycle ($4,100)** and a massive, record-breaking surge in **October to $4,800**.
* **Category Dominance**: **Fashion** continues to serve as our primary growth anchor, claiming **64% of category demand** ($192,000 total revenue), followed by **Electronics at 32%** ($96,000).

**Recommendation**: Increase ad spend in APAC region to capitalize on Emirates customer growth (**8,250** active subscribers).`;
    } else if (
      lowerMsg.includes('top sales') ||
      lowerMsg.includes('best') ||
      lowerMsg.includes('top')
    ) {
      fallbackText = `### 🏆 Top Corporate Sales Channels

An analysis of our primary sales engines reveals the following peak contributors:

1. **Emirates Region**: Leading geographic segment with **8,250 weekly customer cycles** and a high retention rate.
2. **Fashion Portfolio**: Our top performing sector accounts for **64% overall market demand** ($192,000 total revenue), driving a substantial **$192,000** in quarterly revenues.
3. **New York Hub**: Moving fast to secure second place with **7,200 active customers**.

**Strategic Insight**: Cross-sell our premium Electronics packages to high-tier Emirates subscribers to lift average customer contract values.`;
    } else if (
      lowerMsg.includes('low-performing') ||
      lowerMsg.includes('worst') ||
      lowerMsg.includes('slow')
    ) {
      fallbackText = `### ⚠️ Low-Performing Segments Analysis

While performance across the board is stable, the following areas require immediate management oversight:

* **Foods Category**: Captures just **16% market demand** ($48,000 revenue stream). This reflects supply-chain friction and sub-optimal regional marketing.
* **Los Angeles Metro**: lagging behind Emirates and NY at **4,165 active customers**, representing an under-penetrated urban sector with high demographic potential.
* **Foods Revenue Efficiency**: Average margin is 4.5% below targeted benchmarks.

**Remedial Strategy**:
1. Re-negotiate vendor terms for key food lines.
2. Launch a localized focus campaign in the Los Angeles metro region.`;
    } else if (
      lowerMsg.includes('restock') ||
      lowerMsg.includes('alert') ||
      lowerMsg.includes('warning')
    ) {
      fallbackText = `### 🚨 Inventory & System Action Alert

Key highlights for logistics management as of today:

* **Orders in Transit**: **355 processed deliveries** with **40 currently in "Open" or "Pending"** processing status.
* **Stock Security warning**: Fashion category velocity is accelerating rapidly, moving 2.4x regular weekly bounds.
* **Infrastructure**: Nodes are running optimally at **99.9% uptime** (87 general server nodes, 20 active).

**Action Required**: Procure a buffer stock allowance of 15% for hot-ticket Fashion lines to prevent order fulfillment delays.`;
    } else {
      fallbackText = `### 🧠 Teyzix Intelligence Engine

Thank you for your inquiry about current company analytics. Here is what stands out from our performance indicators:

* **Strong Revenue Foundation**: Running at **$12,368** in daily closed earnings.
* **Active Operations**: Logged **355 orders** with optimal processing node configurations.
* **Demand Concentration**: Focus is heavily skewed toward **Fashion (64%)** and the **Emirates segment (8,250 growth)**.

*To activate deeper live query analysis, please ensure your host server API credentials (such as the operational API key) are securely supplied in your production environment variables.*`;
    }

    return { success: true, text: fallbackText };
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
