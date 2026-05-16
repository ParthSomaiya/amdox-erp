import Vendor from "../models/Vendor.js";

export const createVendor = async (req, res) => {
  const vendor = await Vendor.create({
    ...req.body,
    companyId: req.user.companyId,
  });
  res.json(vendor);
};

export const getVendors = async (req, res) => {
  const data = await Vendor.find({ companyId: req.user.companyId });
  res.json(data);
};