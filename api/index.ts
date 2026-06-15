/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { getBaseDashboardData, emptyDashboardData } from "../src/mockData.js";

dotenv.config();

const app = express();

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

app.get("/api/dashboard-data", async (req, res) => {
  try {
    const delayMs = parseInt((req.query.delay as string) || "0", 10);
    const triggerError = req.query.error === "true";
    const requestEmpty = req.query.empty === "true";

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (triggerError) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: Simulated failure on corporate data warehouse connection.",
      });
    }

    if (requestEmpty) {
      return res.json(emptyDashboardData());
    }

    return res.json(getBaseDashboardData());
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unknown error occurred while generating dashboard report.",
    });
  }
});

async function generateContentWithRetry(
  ai: any,
  params: any,
  retries = 3,
  delay = 500,
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errMsg = err?.message || "";
      const isTransient =
        err?.status === 503 ||
        err?.statusCode === 503 ||
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        err?.status === 429 ||
        errMsg.includes("429") ||
        errMsg.includes("Too Many Requests");

      if (isTransient && attempt < retries) {
        console.log(
          `[Teyzix AI] Upstream transient load (503/429) detected. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
}

app.post("/api/copilot", async (req, res) => {
  try {
    const { message, history = [], isEmpty = false } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const dataContext = isEmpty
      ? "The dashboard is CURRENTLY EMPTY (Simulated EMPTY state). No revenue has been recorded, 0 orders placed, and standard tracking charts are zeroed."
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
        model: "gemini-2.0-flash-exp",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I was unable to formulate a response at this time.";
      return res.json({ success: true, text: replyText });
    } catch (apiError: any) {
      console.log("[Teyzix AI] Using fallback response mode.");

      let fallbackText = "";
      const lowerMsg = message.toLowerCase();

      if (lowerMsg.includes("sales report") || lowerMsg.includes("report")) {
        fallbackText = `### 📊 Live Executive Sales Report

* **Daily Net Volume**: **$12,368** daily net run-rate with **20 corporate accounts closed**
* **Monthly Peak Trends**: July peak ($4,100) and October surge to $4,800
* **Category Dominance**: **Fashion** at 64% ($192,000 revenue)`;
      } else {
        fallbackText = `### 🧠 Teyzix Intelligence Engine

Thank you for your inquiry. Our analytics show:
- **Daily Revenue**: $12,368
- **Active Orders**: 355
- **Top Market**: Emirates (8,250 customers)
- **Best Category**: Fashion (64% market share)`;
      }

      return res.json({ success: true, text: fallbackText });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: "Copilot error: " + err.message });
  }
});

// Serve static files for production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

export default app;