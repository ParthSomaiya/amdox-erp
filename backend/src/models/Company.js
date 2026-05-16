import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

export default mongoose.model("Company", companySchema);