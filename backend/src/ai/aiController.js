import openai from "./openai.js";
import { prompts } from "./prompts.js";

// ================= AI CHATBOT =================
export const aiChatbot = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompts.chatbot(message),
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= AI REPORT =================
export const aiReport = async (req, res) => {
  try {
    const { data } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompts.report(data),
        },
      ],
    });

    res.json({
      report: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= AI INVOICE EXTRACTION =================
export const aiInvoiceExtract = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompts.invoice(text),
        },
      ],
    });

    res.json({
      data: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= AI ANALYTICS =================
export const aiAnalytics = async (req, res) => {
  try {
    const { analytics } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Analyze ERP data and give insights:

${JSON.stringify(analytics)}

Return:
- Trends
- Problems
- Suggestions
        `,
        },
      ],
    });

    res.json({
      insights: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};