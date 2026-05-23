import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Designation",
  designationSchema
);