import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  code: String, // USD, INR
  rate: Number, // conversion rate
});

export default mongoose.model("Currency", currencySchema);