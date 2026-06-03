import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true
    },
    date: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, default: null }
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;