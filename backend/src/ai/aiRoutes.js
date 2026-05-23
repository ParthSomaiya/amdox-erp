import express from "express";

import {
  aiChatbot,
  aiReport,
  aiInvoiceExtract,
  aiAnalytics,
} from "./aiController.js";

const router = express.Router();

router.post("/chat", aiChatbot);
router.post("/report", aiReport);
router.post("/invoice", aiInvoiceExtract);
router.post("/analytics", aiAnalytics);

export default router;