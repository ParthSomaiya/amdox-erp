import mongoose from "mongoose";

const arSchema = new mongoose.Schema({
  customerName: String,
  amount: Number,
  status: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
  companyId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});
const Receivable = mongoose.models.Receivable || mongoose.model("Receivable", arSchema);

export const getReceivables = async (req, res) => {
  try {
    let data = await Receivable.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
    if (data.length === 0) {
      data = await Receivable.create([
        { customerName: "Acme Corp", amount: 45000, status: "PENDING", companyId: req.user.companyId },
        { customerName: "Globex Solutions", amount: 35000, status: "PAID", companyId: req.user.companyId }
      ]);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};