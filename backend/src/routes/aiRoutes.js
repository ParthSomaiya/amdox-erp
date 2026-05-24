import express from "express";

import multer from "multer";

import {

  aiChat,
  aiAnalytics,
  invoiceOCR,

} from "../controllers/aiController.js";

const router = express.Router();

const upload =
  multer({
    dest: "uploads/",
  });


// ================= CHAT =================

router.post(
  "/chat",
  aiChat
);


// ================= ANALYTICS =================

router.post(
  "/analytics",
  aiAnalytics
);


// ================= OCR =================

router.post(
  "/ocr",
  upload.single("invoice"),
  invoiceOCR
);

export default router;