import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);