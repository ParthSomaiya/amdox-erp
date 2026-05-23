import express from "express";

import {
  createChat,
  getChats,
  sendMessage,
  getMessages,
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

export default router;