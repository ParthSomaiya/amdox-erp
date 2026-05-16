import Bill from "../models/Bill.js";

export const createBill = async (req, res) => {
  const bill = await Bill.create({
    ...req.body,
    companyId: req.user.companyId,
  });

  res.json(bill);
};

export const payBill = async (req, res) => {
  const bill = await Bill.findByIdAndUpdate(
    req.body.id,
    { status: "PAID" },
    { new: true }
  );

  res.json(bill);
};

export const getBills = async (req, res) => {
  const data = await Bill.find({
    companyId: req.user.companyId,
  }).populate("vendorId");

  res.json(data);
};