import Product from "../models/Product.js";
import StockHistory from "../models/StockHistory.js";

// ➕ Add Product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      companyId: req.user.companyId,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Add Stock
export const addStock = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findById(productId);

    product.stock += quantity;
    await product.save();

    await StockHistory.create({
      productId,
      type: "IN",
      quantity,
      reason,
      companyId: req.user.companyId,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📉 Reduce Stock
export const reduceStock = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findById(productId);

    product.stock -= quantity;
    await product.save();

    await StockHistory.create({
      productId,
      type: "OUT",
      quantity,
      reason,
      companyId: req.user.companyId,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚠️ Low Stock Alert
export const getLowStock = async (req, res) => {
  const products = await Product.find({
    companyId: req.user.companyId,
  });

  const lowStock = products.filter(
    (p) => p.stock <= p.minStock
  );

  res.json(lowStock);
};

// 📊 Inventory Dashboard
export const getInventoryDashboard = async (req, res) => {
  const products = await Product.find({
    companyId: req.user.companyId,
  });

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (acc, p) => acc + p.stock,
    0
  );

  const lowStock = products.filter(
    (p) => p.stock <= p.minStock
  ).length;

  res.json({
    totalProducts,
    totalStock,
    lowStock,
  });
};