import express from "express";
import {
  createPayment,
  createPaymentOrder,
  verifyPaymentOrder
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= ORIGINAL BILLING ROUTE (લોગિન જરૂરી) =================
router.post(
  "/create",
  authMiddleware,
  createPayment
);

// ================= RAZORPAY CATALOG SHOP ROUTES (પબ્લિક - ગેસ્ટ માટે મુક્ત) =================
// 🔹 અહીંથી authMiddleware હટાવી દીધું છે જેથી ગેસ્ટ પણ ઓર્ડર કરી શકે
router.post(
  "/create-order",
  createPaymentOrder
);

router.post(
  "/verify-order",
  verifyPaymentOrder
);

export default router;