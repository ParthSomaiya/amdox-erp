import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    title: String,

    description: String,

    location: String,

    salary: Number,

    type: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
      ],
      default: "FULL_TIME",
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "CLOSED",
      ],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export default
  mongoose.models.Job ||
  mongoose.model(
    "Job",
    jobSchema
  );