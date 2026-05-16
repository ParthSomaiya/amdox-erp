import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  date: {
    type: String, // YYYY-MM-DD
  },
  checkIn: Date,
  checkOut: Date,
  totalHours: Number,
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);