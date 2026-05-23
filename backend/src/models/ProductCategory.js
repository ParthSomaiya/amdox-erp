import mongoose from "mongoose";

const categorySchema =
  new mongoose.Schema({

    name: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

  });

export default mongoose.model(
  "ProductCategory",
  categorySchema
);