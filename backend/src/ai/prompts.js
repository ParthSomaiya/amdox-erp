export const prompts = {
    chatbot: (msg) => `
You are an ERP AI assistant.
Answer clearly, short and helpful.

User: ${msg}
`,

    report: (data) => `
Generate a professional ERP business report.

Data:
${JSON.stringify(data)}

Give:
- Summary
- Insights
- Recommendations
`,

    invoice: (text) => `
Extract invoice data:

Text:
${text}

Return JSON:
{
  vendor,
  amount,
  date,
  gst,
  items
}
`,
};