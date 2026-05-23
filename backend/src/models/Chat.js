import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    name: String,

    isGroup: {
      type: Boolean,
      default: false,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Chat",
  chatSchema
);