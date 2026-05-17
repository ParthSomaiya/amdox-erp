import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: String, // e.g. "CREATE_INVOICE"
});

export default mongoose.models.Permission ||
  mongoose.model("Permission", permissionSchema);