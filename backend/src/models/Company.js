import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Company", companySchema);