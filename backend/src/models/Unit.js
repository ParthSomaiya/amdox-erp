import mongoose from "mongoose";

const unitSchema =
  new mongoose.Schema({

    name: String,

    shortName: String,

  });

export default mongoose.model(
  "Unit",
  unitSchema
);