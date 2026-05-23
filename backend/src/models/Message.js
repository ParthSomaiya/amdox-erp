import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: String,

    attachment: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "Message",
  messageSchema
);