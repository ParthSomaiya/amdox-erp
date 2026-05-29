import mongoose from "mongoose";

const recSchema = new mongoose.Schema({
  amount: Number,
  matched: { type: Boolean, default: false },
  description: String,
  companyId: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: Date.now }
});
const Reconciliation = mongoose.models.Reconciliation || mongoose.model("Reconciliation", recSchema);

export const reconcile = async (req, res) => {
  try {
    let data = await Reconciliation.find({ companyId: req.user.companyId }).sort({ date: -1 });
    if (data.length === 0) {
      data = await Reconciliation.create([
        { amount: 25000, matched: true, description: "Rent Transfer Match", companyId: req.user.companyId },
        { amount: 85000, matched: true, description: "Consulting Payout Match", companyId: req.user.companyId },
        { amount: 12000, matched: false, description: "Unknown Cash Deposit", companyId: req.user.companyId }
      ]);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};