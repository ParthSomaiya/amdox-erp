import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  name: String,
  domain: String,
  active: { type: Boolean, default: true },
});

export default mongoose.models.Tenant ||
  mongoose.model("Tenant", tenantSchema);