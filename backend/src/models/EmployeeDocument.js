import mongoose from "mongoose";

const employeeDocumentSchema =
  new mongoose.Schema(
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      resume: String,

      aadhaar: String,

      pan: String,

      contract: String,
    },
    { timestamps: true }
  );

export default mongoose.model(
  "EmployeeDocument",
  employeeDocumentSchema
);