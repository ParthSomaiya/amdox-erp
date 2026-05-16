import Payroll from "../models/Payroll.js";
import { sendNotification } from "../utils/notify.js";

// ➕ Generate Payroll
export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, basicSalary, bonus, deductions, month } = req.body;

    const netSalary = basicSalary + bonus - deductions;

    const payroll = await Payroll.create({
      employeeId,
      companyId: req.user.companyId,
      month,
      basicSalary,
      bonus,
      deductions,
      netSalary,
    });

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Payroll error" });
  }
};

// 💰 Mark Paid (SECURE)
export const markPaid = async (req, res) => {
  try {
    const { payrollId } = req.body;

    const payroll = await Payroll.findOneAndUpdate(
      {
        _id: payrollId,
        companyId: req.user.companyId, // ✅ FIXED
      },
      { status: "PAID" },
      { new: true }
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    await sendNotification(
      payroll.employeeId,
      "Salary credited"
    );

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Error marking paid" });
  }
};

// 📋 All Payroll
export const getAllPayroll = async (req, res) => {
  const data = await Payroll.find({
    companyId: req.user.companyId,
  }).populate("employeeId", "email");

  res.json(data);
};

// 👤 My Payroll
export const getMyPayroll = async (req, res) => {
  const data = await Payroll.find({
    employeeId: req.user.id,
    companyId: req.user.companyId, // ✅ FIXED
  });

  res.json(data);
};