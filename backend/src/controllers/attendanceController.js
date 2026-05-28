import Attendance from "../models/Attendance.js";
import { syncBiometricAttendance } from "../services/biometricService.js";

// ================= UTILITY =================
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// ================= 🟢 CHECK IN =================
export const checkIn = async (req, res) => {
  try {
    const today = getTodayDate();

    // check existing attendance
    const existingAttendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in today",
      });
    }

    const newAttendance = await Attendance.create({
      employeeId: req.user.id,
      companyId: req.user.companyId,
      date: today,
      checkIn: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: newAttendance,
    });
  } catch (err) {
    console.error("Check-in error:", err);
    return res.status(500).json({
      success: false,
      message: "Check-in failed",
    });
  }
};

// ================= 🔴 CHECK OUT =================
export const checkOut = async (req, res) => {
  try {
    const today = getTodayDate();

    const attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "No check-in record found",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out",
      });
    }

    const checkOutTime = new Date();

    const checkInTime = new Date(attendance.checkIn);

    const hoursWorked =
      (checkOutTime.getTime() - checkInTime.getTime()) /
      (1000 * 60 * 60);

    attendance.checkOut = checkOutTime;
    attendance.totalHours = Number(hoursWorked.toFixed(2));

    await attendance.save();

    return res.json({
      success: true,
      message: "Check-out successful",
      data: attendance,
    });
  } catch (err) {
    console.error("Check-out error:", err);
    return res.status(500).json({
      success: false,
      message: "Check-out failed",
    });
  }
};

// ================= 👨‍💼 GET ALL ATTENDANCE (HR) =================
export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({
      companyId: req.user.companyId,
    })
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Get all attendance error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

// ================= 👤 GET MY ATTENDANCE =================
export const getMyAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({
      employeeId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Get my attendance error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your attendance",
    });
  }
};

// ================= 🧬 BIOMETRIC SYNC =================
export const biometricSync = async (req, res) => {
  try {
    const employees = req.body?.employees;

    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee data",
      });
    }

    const result = await syncBiometricAttendance(employees);

    return res.json({
      success: true,
      message: "Biometric synced successfully",
      data: result,
    });
  } catch (err) {
    console.error("Biometric sync error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Biometric sync failed",
    });
  }
};