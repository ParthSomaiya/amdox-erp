import express
from "express";

import {
  getMessages,
  sendMessage
} from "../controllers/chatController.js";

import {
  authMiddleware,
} from "../../../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(

  "/:room",

  authMiddleware,

  getMessages

);

router.post("/", sendMessage);
router.get("/:id", getMessages);

export default router;