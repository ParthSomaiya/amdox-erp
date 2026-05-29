import mongoose from "mongoose";
import bwipjs from "bwip-js";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import Timeline from "../models/Timeline.js";
import User from "../models/User.js"; 
import { predictReorder } from "../services/reorderAI.js";

// 🔹 ઓરીજીનલ મોડેલ્સ સીધા જ તેમના પાથ પરથી ઇમ્પોર્ટ કર્યા
import Product from "../models/Product.js"; 
import PurchaseOrder from "../models/PurchaseOrder.js";

// Safe fallback check for StockHistory to avoid duplicate schema compilation
const StockHistory = mongoose.models.StockHistory || mongoose.model("StockHistory", new mongoose.Schema({
  productName: String,
  quantity: Number,
  type: { type: String, enum: ["IN", "OUT"] },
  reason: String,
  companyId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
}));

// =====================================
// 📦 CREATE PRODUCT WITH IMAGE (Force Write - Strict: False)
// =====================================
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, quantity, lowStockLimit } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : ""; 

    if (!name) {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }

    let companyId = req.user?.companyId;
    if (!companyId) {
      const userObj = await User.findById(req.user.id || req.user._id);
      companyId = userObj?.companyId;
    }
    if (!companyId) {
      const fallbackAdmin = await User.findOne({ role: "ADMIN" });
      companyId = fallbackAdmin?.companyId || new mongoose.Types.ObjectId();
    }

    const uniqueBarcode = `AMD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 🔹 મોન્ગુસ સ્કીમામાં ડિક્લેર ન હોવા છતાં ફોર્સ રાઇટ (Force Write) કરવા માટે નવો ડોક્યુમેન્ટ ઓબ્જેક્ટ બનાવ્યો
    const product = new Product({
      name,
      price: Number(price || 0),
      quantity: Number(stock || quantity || 0), 
      lowStockLimit: Number(lowStockLimit || 15),
      barcode: uniqueBarcode,
      companyId,
    });

    // 🔹 મજબૂત ફોર્સ સેવ પ્રોટોકોલ (બધી એરર્સ કાયમ માટે સોલ્વ થશે!)
    product.set("image", imagePath, { strict: false });
    product.set("barcode", uniqueBarcode, { strict: false });
    
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ success: false, message: "Failed to add product: " + err.message });
  }
};

// =====================================
// 📋 GET PRODUCTS (Strict: False for retrieving image)
// =====================================
export const getProducts = async (req, res) => {
  try {
    const query = {};
    if (req.user?.companyId) {
      query.companyId = req.user.companyId;
    }

    // 🔹 ડાયનેમિક સેટિંગ્સ: જો કલેક્શન પ્રોપર્ટી સ્કીમા બહાર સેવ થઈ હોય તો પણ તેને લોડ કરો
    const products = await Product.find(query).lean({ strict: false }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 📦 INVENTORY DASHBOARD CONTROLLER
// =====================================
export const getInventoryDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ companyId: req.user.companyId });
    const products = await Product.find({ companyId: req.user.companyId }).lean({ strict: false });
    const totalStock = products.reduce((acc, p) => acc + (p.quantity || p.stock || 0), 0);
    const lowStock = products.filter(p => (p.quantity || p.stock || 0) <= (p.lowStockLimit || 15)).length;

    res.json({
      totalProducts: totalProducts || 0,
      totalStock: totalStock || 0,
      lowStock: lowStock || 0,
      totalValue: totalStock * 150 || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// ✏️ UPDATE PRODUCT (Strict: False Support)
// =====================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body };
    
    if (req.body.stock !== undefined) {
      updateFields.quantity = Number(req.body.stock);
    }

    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    // 🔹 મોન્ગુસ સ્કીમામાં ડિક્લેર ન હોય તો પણ ઈમેજ અપડેટ ફોર્સ-રાઇટ કરવા માટે { strict: false } સેટ કર્યું
    const updated = await Product.findByIdAndUpdate(
      id, 
      { $set: updateFields }, 
      { new: true, strict: false } 
    );
    
    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// ❌ DELETE PRODUCT
// =====================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// 🕒 STOCK HISTORY MOVEMENTS
// =====================================
export const getStockHistory = async (req, res) => {
  try {
    let data = await StockHistory.find({ companyId: req.user?.companyId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 📝 CREATE PURCHASE ORDER
// =====================================
export const createPurchaseOrder = async (req, res) => {
  try {
    const { vendor, product, quantity } = req.body;

    const po = await PurchaseOrder.create({
      vendorName: vendor,
      vendorEmail: "vendor@supplychain.com",
      productName: product,
      quantity: Number(quantity),
      total: Number(quantity) * 5000, 
      companyId: req.user?.companyId || null
    });

    await Timeline.create({
      employee: req.user.id,
      action: `New Purchase Order Created: ${quantity} units of ${product} ordered to ${vendor} by Admin`,
      companyId: req.user.companyId
    });

    res.status(201).json({ success: true, message: "Purchase Order Created", po });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 પર્ચેઝ ઓર્ડર મેળવો
export const getPurchaseOrders = async (req, res) => {
  try {
    let data = await PurchaseOrder.find({ companyId: req.user?.companyId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 🔔 LOW STOCK PRODUCTS
// =====================================
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: [
          "$stock",
          "$lowStockLimit",
        ],
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// ⏱ GENERATE BARCODE (bwip-js)
// =====================================
export const generateBarcode = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const barcode = `AMD-${Date.now()}`;
    product.barcode = barcode;
    await product.save();

    bwipjs.toBuffer({
      bcid: "code128",
      text: barcode,
      scale: 3,
      height: 10,
      includetext: true,
    }, (err, png) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
      res.set("Content-Type", "image/png");
      res.send(png);
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// 🔄 AUTO REORDER
// =====================================
export const autoReorder = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: [
          "$stock",
          "$lowStockLimit",
        ],
      },
    });

    const reorderList = products.map((p) => ({
      product: p.name,
      currentStock: p.stock,
      suggestedOrder: p.lowStockLimit * 5,
    }));

    res.json(reorderList);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// 🧬 GENERATE QR CODE
// =====================================
export const generateQRCode = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const qrData = {
      product: product.name,
      stock: product.stock,
      barcode: product.barcode,
    };

    const qr = await QRCode.toDataURL(JSON.stringify(qrData));
    product.qrCode = qr;
    await product.save();

    res.json({
      qr,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// 🤖 AI REORDER PREDICTION
// =====================================
export const reorderPrediction = async (req, res) => {
  try {
    const products = await Product.find({
      companyId: req.user.companyId,
    });

    const result = products.map((p) => ({
      product: p.name,
      ...predictReorder(p),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};