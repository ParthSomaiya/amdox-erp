import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  module: String,
});

export default mongoose.models.Permission ||
  mongoose.model("Permission", permissionSchema);