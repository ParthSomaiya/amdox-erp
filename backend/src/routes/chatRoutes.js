import express from "express";

import {
  createChat,
  getChats,
  sendMessage,
  getMessages,
  reactMessage,
  editMessage,
  deleteMessage,
} from "../controllers/chatController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================
// CHAT
// ==========================

router.post(
  "/create",
  protect,
  createChat
);

router.get(
  "/",
  protect,
  getChats
);


// ==========================
// MESSAGE
// ==========================

router.post(
  "/message",
  protect,
  sendMessage
);

router.get(
  "/message/:chatId",
  protect,
  getMessages
);

router.put(
  "/reaction/:id",
  protect,
  reactMessage
);

router.put(
  "/edit/:id",
  protect,
  editMessage
);

router.put(
  "/delete/:id",
  protect,
  deleteMessage
);

export default router;