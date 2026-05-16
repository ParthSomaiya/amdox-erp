import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  designation: String,
  department: String,
  salary: Number,
  joiningDate: Date,
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
}, { timestamps: true });

export default mongoose.model("EmployeeProfile", employeeProfileSchema);