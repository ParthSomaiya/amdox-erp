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


    // ==========================
    // REACTIONS
    // ==========================

    reactions: [

      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        emoji: String,
      },

    ],


    // ==========================
    // EDIT HISTORY
    // ==========================

    edited: {
      type: Boolean,
      default: false,
    },

    editHistory: [

      {
        oldMessage: String,
        editedAt: Date,
      },

    ],


    // ==========================
    // DELETE STATUS
    // ==========================

    deletedForEveryone: {
      type: Boolean,
      default: false,
    },

  },

  { timestamps: true }

);

export default mongoose.model(
  "Message",
  messageSchema
);