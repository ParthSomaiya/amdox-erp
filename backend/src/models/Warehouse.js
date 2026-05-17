import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  location: String,
});

export default mongoose.models.Warehouse || mongoose.model("Warehouse", schema);