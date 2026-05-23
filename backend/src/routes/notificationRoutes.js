import express from "express";

const router = express.Router();

import {

  createNotification,

  getNotifications,

  markRead,

  markAllRead,

  deleteNotification,

  sendEmailNotification,

} from "../controllers/notificationController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";


// ==============================
// GET
// ==============================

router.get(
  "/",
  protect,
  getNotifications
);


// ==============================
// CREATE
// ==============================

router.post(
  "/",
  protect,
  createNotification
);


// ==============================
// MARK READ
// ==============================

router.put(
  "/read/:id",
  protect,
  markRead
);


// ==============================
// MARK ALL READ
// ==============================

router.put(
  "/read-all",
  protect,
  markAllRead
);


// ==============================
// DELETE
// ==============================

router.delete(
  "/:id",
  protect,
  deleteNotification
);


// ==============================
// EMAIL
// ==============================

router.post(
  "/email",
  protect,
  sendEmailNotification
);

export default router;