import Attendance from "../models/Attendance.js";
import { detectAnomaly } from "../services/aiAttendanceService.js";

export const checkAttendanceAnomaly = async (req, res) => {
  try {
    const records = await Attendance.find({
      companyId: req.user.companyId,
    });

    const anomalies = detectAnomaly(records);

    res.json({ anomalies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};