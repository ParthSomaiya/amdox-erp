import express from "express";
import { downloadInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/invoice", downloadInvoice);

export default router;