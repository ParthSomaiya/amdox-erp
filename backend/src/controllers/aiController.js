import { askGemini } from "../services/geminiService.js";
import { extractInvoiceText } from "../services/invoiceOCR.js";

// ================= AI CHAT (RESOLVES PROMPT/MESSAGE PAYLOAD KEYS) =================
export const aiChat = async (req, res) => {
  try {
    // Accommodate both "prompt" (AIAssistant.jsx) and "message" (SmartSearch.jsx) payload keys
    const message = req.body.message || req.body.prompt;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "A prompt or message parameter is required.",
      });
    }

    const response = await askGemini(message);

    // Normalize response key to "reply" to resolve frontend UI errors
    res.json({
      success: true,
      reply: response,
      response: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= AI ANALYTICS =================
export const aiAnalytics = async (req, res) => {
  try {
    const prompt = `
      Analyze the following business parameters:
      - Total Revenue: ${req.body.revenue || "0"}
      - Total Expenses: ${req.body.expenses || "0"}
      - Total Employees: ${req.body.employees || "0"}

      Provide core business insights, trend analysis, and actionable recommendations.
    `;

    const response = await askGemini(prompt);

    // Normalize response keys to satisfy AIInsightsCards.jsx
    res.json({
      success: true,
      insights: response,
      reply: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= OCR INVOICE =================
export const invoiceOCR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No invoice file uploaded.",
      });
    }

    const text = await extractInvoiceText(req.file.path);

    res.json({
      success: true,
      text,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};