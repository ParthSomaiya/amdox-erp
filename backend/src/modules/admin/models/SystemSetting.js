import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    key: String,
    value: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("SystemSetting", settingSchema);