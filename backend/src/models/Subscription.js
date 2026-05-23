import mongoose from "mongoose";

const subscriptionSchema =
  new mongoose.Schema({

    companyId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    plan: {
      type: String,
      enum: [
        "FREE",
        "PRO",
        "ENTERPRISE",
      ],
      default: "FREE",
    },

    amount: Number,

    startDate: Date,

    endDate: Date,

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "EXPIRED",
      ],
      default: "ACTIVE",
    },

  }, { timestamps: true });

export default mongoose.model(
  "Subscription",
  subscriptionSchema
);