import Message from "../models/Message.js";
import { getIO } from "../../../utils/socket.js";

export const sendMessage = async (req, res) => {
  const msg = await Message.create(req.body);

  const io = getIO();

  io.emit("new-message", msg);

  res.json(msg);
};

export const getMessages = async (req, res) => {
  const msgs = await Message.find({
    $or: [
      { senderId: req.params.id },
      { receiverId: req.params.id },
    ],
  });

  res.json(msgs);
};