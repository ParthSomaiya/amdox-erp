import mongoose from "mongoose"; // 🔹 ૧. સૌથી ઉપર મોડ્યુલ ઇમ્પોર્ટ કર્યું (Crucial Fix)
import User from "../models/User.js";
import { syncBiometricAttendance } from "../services/biometricService.js";

import Attendance from "../models/Attendance.js";

// ૧. કર્મચારી ચેક-ઇન કરે
export const checkIn = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    
    // ચકાસો કે આજે પહેલેથી જ ચેક-ઇન કરેલું છે કે નહીં
    const existing = await Attendance.findOne({
      employeeId: req.user.id,
      date: todayStr
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const record = await Attendance.create({
      employeeId: req.user.id,
      date: todayStr,
      checkIn: new Date().toISOString(),
      checkOut: null
    });

    res.json({ success: true, data: record });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Check-in error" });
  }
};

// ૨. કર્મચારી ચેક-આઉટ કરે
export const checkOut = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    
    const record = await Attendance.findOne({
      employeeId: req.user.id,
      date: todayStr,
      checkOut: null
    });

    if (!record) {
      return res.status(400).json({ message: "No active check-in found for today" });
    }

    record.checkOut = new Date().toISOString();
    await record.save();

    res.json({ success: true, data: record });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ message: "Check-out error" });
  }
};

// ૩. લોગિન થયેલા એમ્પ્લોયીનો પોતાનો ડેટા મેળવવો
export const getMyAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

// ૪. એડમિન/HR માટે તમામ કર્મચારીઓની હાજરી મેળવવી
export const getAllAttendance = async (req, res) => {
  try {
    // યુઝર કલેક્શનમાંથી કર્મચારીનું નામ લોડ કરવા પોપ્યુલેટ કરો
    const data = await Attendance.find()
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all attendance" });
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