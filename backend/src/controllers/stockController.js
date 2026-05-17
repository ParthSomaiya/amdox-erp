import StockMovement from "../models/StockMovement.js";

export const getStockHistory = async (req, res) => {
  const data = await StockMovement.find().populate("productId warehouseId");
  res.json(data);
};