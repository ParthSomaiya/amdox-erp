import Invoice from "../models/Invoice.js";

export const getReceivables = async (req, res) => {
  const data = await Invoice.find({
    companyId: req.user.companyId,
    status: "UNPAID",
  });

  res.json(data);
};