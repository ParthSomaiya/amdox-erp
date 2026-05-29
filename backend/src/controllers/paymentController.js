import Razorpay from "razorpay";
import crypto from "crypto";
import Product from "../models/Product.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import StockHistory from "../models/StockHistory.js";

const razorpay = new Razorpay({
  key_id: "rzp_test_SvHkUG3LDOpePY", // 🔹 તમારો સાચો Razorpay Key ID ઉમેરો
  key_secret: "nz6tzVQ2MnizZSw1HnyhvYLj" // 🔹 તમારો સાચો Razorpay Key Secret ઉમેરો
});

// ================= ORIGINAL BILLING CONTROLLER =================
export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    // બિલિંગ રિડાયરેક્ટ માટે ટેસ્ટિંગ સિક્યોર લિંક
    res.status(200).json({ url: "https://pages.razorpay.com/pl_test_billing" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= RAZORPAY CATALOG SHOP ORDER =================
export const createPaymentOrder = async (req, res) => {
  try {
    const { productId, amount } = req.body;
    const product = await Product.findById(productId);

    if (!product || product.quantity < 1) {
      return res.status(400).json({ success: false, message: "Product Out of Stock" });
    }

    const options = {
      amount: amount * 100, // પૈસામાં કન્વર્ટ કરવા
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= RAZORPAY ORDER VERIFICATION =================
export const verifyPaymentOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "nz6tzVQ2MnizZSw1HnyhvYLj") 
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const product = await Product.findById(productId);
      if (!product || product.quantity < 1) {
        return res.status(400).json({ success: false, message: "Out of Stock" });
      }

      const previousStock = product.quantity;
      const newStock = previousStock - 1;

      // ૧. સ્ટોક ક્વાન્ટિટી માઇનસ કરવી
      product.quantity = newStock;
      await product.save();

      // ૨. પર્ચેઝ ઓર્ડર સેવ કરવો (પ્રોડક્ટની companyId સાથે ગેસ્ટ ચેકઆઉટ સપોર્ટ!)
      const newPO = new PurchaseOrder({
        companyId: product.companyId, // 🔹 ઓટોમેટિકલી પ્રોડક્ટની કંપની સેવ થશે
        vendorId: "65f012345678901234567890", 
        items: [
          {
            productId: product._id,
            quantity: 1,
            price: product.price
          }
        ],
        status: "PENDING"
      });
      await newPO.save();

      // ૩. સ્ટોક હિસ્ટ્રી મેન્ટેન કરવી
      const history = new StockHistory({
        productId: product._id,
        action: "REMOVE",
        quantity: 1,
        previousStock: previousStock,
        newStock: newStock
      });
      await history.save();

      return res.status(200).json({ success: true, message: "Payment Verified & Systems Updated Successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Signature!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};