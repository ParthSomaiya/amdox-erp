import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: String,
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

export default mongoose.models.Role ||
  mongoose.model("Role", roleSchema);