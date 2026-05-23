import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: [
        "INFO",
        "WARNING",
        "SUCCESS",
        "ERROR",
      ],
      default: "INFO",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    meta: Object,
  },
  { timestamps: true }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);