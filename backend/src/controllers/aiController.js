import { askGemini } from "../services/geminiService.js";

import {
    extractInvoiceText,
} from "../services/invoiceOCR.js";


// ================= AI CHAT =================

export const aiChat =
    async (req, res) => {

        try {

            const { message } = req.body;

            const response =
                await askGemini(message);

            res.json({

                success: true,
                response,

            });

        } catch (err) {

            res.status(500).json({

                success: false,
                message: err.message,

            });

        }

    };


// ================= AI ANALYTICS =================

export const aiAnalytics =
    async (req, res) => {

        try {

            const prompt = `
      Analyze business performance:
      Revenue: ${req.body.revenue}
      Expenses: ${req.body.expenses}
      Employees: ${req.body.employees}

      Give insights and recommendations.
      `;

            const response =
                await askGemini(prompt);

            res.json({

                success: true,
                insights: response,

            });

        } catch (err) {

            res.status(500).json({

                success: false,
                message: err.message,

            });

        }

    };



// ================= OCR =================

export const invoiceOCR =
    async (req, res) => {

        try {

            const text =
                await extractInvoiceText(
                    req.file.path
                );

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