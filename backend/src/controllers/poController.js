import PurchaseOrder from "../models/PurchaseOrder.js";
import Product from "../models/Product.js";

export const createPO = async (req, res) => {
  const po = await PurchaseOrder.create({
    ...req.body,
    companyId: req.user.companyId,
  });
  res.json(po);
};

export const receivePO = async (req, res) => {
  const { id } = req.body;

  const po = await PurchaseOrder.findById(id);

  for (let item of po.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { quantity: item.quantity },
    });
  }

  po.status = "RECEIVED";
  await po.save();

  res.json({ message: "Stock updated" });
};

export const getPOs = async (req, res) => {
  const data = await PurchaseOrder.find({
    companyId: req.user.companyId,
  }).populate("vendorId");
  res.json(data);
};