import express from "express";

import {
  createSubscription,
  getSubscriptions,
} from "../controllers/subscriptionController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  createSubscription
);

router.get(
  "/",
  protect,
  getSubscriptions
);

export default router;