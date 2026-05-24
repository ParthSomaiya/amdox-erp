import Attendance from "../models/Attendance.js";

import {
  syncBiometricAttendance,
} from "../services/biometricService.js";

// 🟢 Check In
export const checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const exists = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (exists) {
      return res.status(400).json({ message: "Already checked in" });
    }

    const record = await Attendance.create({
      employeeId: req.user.id,
      companyId: req.user.companyId,
      date: today,
      checkIn: new Date(),
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Check-in failed" });
  }
};

// 🔴 Check Out
export const checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (!record || record.checkOut) {
      return res.status(400).json({ message: "Invalid checkout" });
    }

    const checkOutTime = new Date();
    const hours =
      (checkOutTime - new Date(record.checkIn)) / (1000 * 60 * 60);

    record.checkOut = checkOutTime;
    record.totalHours = hours.toFixed(2);

    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Check-out failed" });
  }
};

// 👨‍💼 HR view all
export const getAllAttendance = async (req, res) => {
  const data = await Attendance.find({
    companyId: req.user.companyId,
  }).populate("employeeId", "email");

  res.json(data);
};

// 👤 Employee view own
export const getMyAttendance = async (req, res) => {
  const data = await Attendance.find({
    employeeId: req.user.id,
  });

  res.json(data);
};

export const biometricSync =
  async (req, res) => {

    try {

      const employees =
        req.body.employees;

      const result =
        await syncBiometricAttendance(
          employees
        );

      res.json({
        success: result.success,
        message:
          "Biometric synced",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };