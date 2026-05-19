import express from "express";

import {
  createBudget,
  getBudgets,
} from "../controllers/budgetController.js";

import {
  authMiddleware,
} from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createBudget
);

router.get(
  "/",
  authMiddleware,
  getBudgets
);

export default router;