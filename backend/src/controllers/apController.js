import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  vendorId: { name: String, email: String },
  amount: Number,
  status: { type: String, enum: ["UNPAID", "PAID"], default: "UNPAID" },
  companyId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});
const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);

export const createBill = async (req, res) => {
  try {
    const { name, email, amount } = req.body;
    const bill = await Bill.create({
      vendorId: { name, email },
      amount,
      companyId: req.user.companyId,
    });
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBills = async (req, res) => {
  try {
    let data = await Bill.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
    if (data.length === 0) {
      data = await Bill.create([
        { vendorId: { name: "AWS Cloud", email: "billing@aws.com" }, amount: 15000, status: "UNPAID", companyId: req.user.companyId },
        { vendorId: { name: "Office Stationery Corp", email: "sales@stationery.com" }, amount: 3500, status: "PAID", companyId: req.user.companyId }
      ]);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const payBill = async (req, res) => {
  try {
    const { id } = req.body;
    const bill = await Bill.findByIdAndUpdate(id, { status: "PAID" }, { new: true });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};