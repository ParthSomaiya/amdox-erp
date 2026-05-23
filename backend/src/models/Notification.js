import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      title: String,

      message: String,

      type: {
        type: String,

        enum: [
          "INFO",
          "SUCCESS",
          "WARNING",
          "ERROR",
          "CHAT",
          "PAYROLL",
          "LEAVE",
          "PROJECT",
        ],

        default: "INFO",
      },

      isRead: {
        type: Boolean,
        default: false,
      },

      link: String,
    },

    { timestamps: true }
  );

export default
  mongoose.models.Notification ||

  mongoose.model(
    "Notification",
    notificationSchema
  );