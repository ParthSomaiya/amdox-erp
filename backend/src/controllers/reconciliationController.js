import Transaction from "../models/Transaction.js";

export const reconcile = async (req, res) => {
  const transactions = await Transaction.find({
    companyId: req.user.companyId,
  });

  const matched = transactions.map((t) => ({
    ...t._doc,
    matched: true,
  }));

  res.json(matched);
};