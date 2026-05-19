import Invoice from "../models/Invoice.js";
import { calculateFinanceAnalytics } from "../services/financeAnalyticsService.js";

export const getFinanceAnalytics = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      companyId: req.user.companyId,
    });

    const analytics = calculateFinanceAnalytics(invoices);

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};