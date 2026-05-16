import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    companyId: req.user.companyId,
  });
  res.json(product);
};

export const getProducts = async (req, res) => {
  const data = await Product.find({ companyId: req.user.companyId });
  res.json(data);
};