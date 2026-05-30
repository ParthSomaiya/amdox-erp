import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";
import User from "../models/User.js";
import Payroll from "../models/Payroll.js";
import Timeline from "../models/Timeline.js";
import Attendance from "../models/Attendance.js";

// =====================================
// 📌 TIMELINE
// =====================================
export const getTimeline = async (req, res) => {
  try {
    const data = await Timeline.find()
      .populate("employee", "name")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 👨‍💼 ADD EMPLOYEE (મોજુદ યુઝર આઈડી સાથે)
// =====================================
export const addEmployee = async (req, res) => {
  try {
    const { userId, position, salary } = req.body;

    const employee = await Employee.create({
      userId,
      position,
      salary: Number(salary || 0),
      companyId: req.user.companyId,
      joiningDate: new Date(),
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// ➕ CREATE EMPLOYEE (ADMIN/HR) - સંપૂર્ણ ડાયનેમિક ઓનબોર્ડિંગ
// =====================================
export const createEmployee = async (req, res) => {
  try {
    const { name, email, position, password, salary } = req.body;

    if (!name || !email || !position || !password || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An employee with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: "EMPLOYEE",
      companyId: req.user?.companyId || null,
      isVerified: true,
    });

    const newEmployee = await Employee.create({
      userId: newUser._id,
      position,
      salary: Number(salary),
      companyId: req.user?.companyId || null,
      joiningDate: new Date(),
    });

    await Timeline.create({
      employee: newUser._id,
      action: `New Employee Onboarded: ${newUser.name} was added as ${position} by ${req.user.name}`,
      companyId: req.user.companyId,
    });

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: newEmployee,
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    return res.status(500).json({ message: "Server error while adding employee" });
  }
};

// =====================================
// ✏️ UPDATE EMPLOYEE (ALL FIELDS)
// =====================================
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, position, password, salary } = req.body;

    const emp = await Employee.findById(id);
    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    emp.position = position || emp.position;
    if (salary !== undefined) {
      emp.salary = Number(salary);
    }
    await emp.save();

    const userUpdate = {};
    if (name) userUpdate.name = name;
    if (email) userUpdate.email = email.toLowerCase().trim();
    if (password) {
      userUpdate.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(emp.userId, { $set: userUpdate });
    }

    res.json({ success: true, message: "Employee updated successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// ❌ DELETE EMPLOYEE & USER ACCOUNT
// =====================================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const emp = await Employee.findById(id);
    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(id);
    await User.findByIdAndDelete(emp.userId);

    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// 📂 UPLOAD EMPLOYEE DOCUMENTS (Aadhaar & PAN)
// =====================================
export const uploadEmployeeDocs = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    if (req.files) {
      if (req.files.resume) updateData.resume = `uploads/${req.files.resume[0].filename}`;
      if (req.files.aadhaar) updateData.aadhaar = `uploads/${req.files.aadhaar[0].filename}`;
      if (req.files.pan) updateData.pan = `uploads/${req.files.pan[0].filename}`;
    }

    const updated = await Employee.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, strict: false }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Documents uploaded successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// 📂 UPDATE USER RESUME (PROFILE - JOB SEEKER)
// =====================================
export const updateUserResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a resume file" });
    }

    const resumePath = `uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { $set: { resume: resumePath } },
      { new: true, strict: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Resume uploaded successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// 👥 GET ALL EMPLOYEES
// =====================================
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      companyId: req.user.companyId,
    }).populate("userId", "name email");

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 🟡 LEAVES (EMPLOYEE)
// =====================================
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType } = req.body;

    const leave = await Leave.create({
      employeeId: req.user.id,
      companyId: req.user.companyId,
      fromDate,
      toDate,
      reason,
      leaveType: leaveType || "CASUAL",
      status: "PENDING",
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      companyId: req.user.companyId,
    }).populate("employeeId", "name email");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaveBalance = async (req, res) => {
  try {
    let balance = await LeaveBalance.findOne({
      employeeId: req.user.id,
    });

    if (!balance) {
      balance = await LeaveBalance.create({
        employeeId: req.user.id,
        companyId: req.user?.companyId || null,
        casual: 8,
        sick: 5,
        paid: 12,
        usedLeaves: 0,
        remainingLeaves: 25,
      });
    }

    res.json({
      success: true,
      balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// ✅ LEAVE APPROVAL (HR)
// =====================================
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const days = Math.ceil(
      (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
    ) || 1;

    leave.status = "APPROVED";
    leave.history.push({
      status: "APPROVED",
      changedBy: req.user.id,
      changedAt: new Date(),
    });

    await leave.save();

    const balance = await LeaveBalance.findOne({
      employeeId: leave.employeeId,
    });

    if (balance) {
      balance.usedLeaves += days;
      balance.remainingLeaves = Math.max(0, balance.remainingLeaves - days);
      await balance.save();
    }

    res.json({ success: true, message: "Leave approved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = "REJECTED";
    leave.history.push({
      status: "REJECTED",
      changedBy: req.user.id,
      changedAt: new Date(),
    });

    await leave.save();

    res.json({ success: true, message: "Leave rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 📊 HR ANALYTICS
// =====================================
export const hrAnalytics = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({
      companyId: req.user.companyId,
    });

    const totalLeaves = await Leave.countDocuments({
      companyId: req.user.companyId,
    });

    res.json({
      totalEmployees,
      totalLeaves,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 🔍 SEARCH EMPLOYEES
// =====================================
export const searchEmployees = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const employees = await User.find({
      companyId: req.user.companyId,
      name: { $regex: search, $options: "i" },
    });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 💰 AUTO PAYROLL GENERATION 
// =====================================
export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, basicSalary, bonus, deduction, deductions, companyId } = req.body;

    const cleanBonus = Number(bonus || 0);
    const cleanBasic = Number(basicSalary || 0);
    const manualDeduction = Number(deduction || deductions || 0);

    if (!employeeId || !month) {
      return res.status(400).json({ success: false, message: "Employee and Month are required" });
    }

    // રજિસ્ટર થયેલા કર્મચારીના રેકોર્ડ મેળવો
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee record not found" });
    }

    // companyId સેનિટાઈઝેશન
    let finalCompanyId = companyId || employee.companyId || req.user?.companyId;
    if (!finalCompanyId || finalCompanyId === null || String(finalCompanyId) === "null" || String(finalCompanyId) === "undefined") {
      const userObj = await User.findById(req.user?.id || req.user?._id);
      finalCompanyId = userObj?.companyId;
    }
    if (!finalCompanyId || finalCompanyId === null || String(finalCompanyId) === "null" || String(finalCompanyId) === "undefined") {
      const fallbackAdmin = await User.findOne({ role: "ADMIN" });
      finalCompanyId = fallbackAdmin?.companyId || new mongoose.Types.ObjectId();
    }

    // ૧. તે મહિનાની મંજૂર થયેલી રજાઓ (Approved Leaves) ગણો
    const approvedLeaves = await Leave.find({
      employeeId,
      status: "APPROVED"
    });

    let unpaidLeaveDays = 0;
    approvedLeaves.forEach(leave => {
      const leaveMonth = new Date(leave.fromDate).toISOString().slice(0, 7);
      if (leaveMonth === month) {
        const days = Math.ceil(
          (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
        ) || 1;
        unpaidLeaveDays += days;
      }
    });

    // ૨. ઓટોમેટિક દિવસ મુજબનો લીવ પગાર કાપ (Leave Deduction)
    const leaveDeduction = Math.round((cleanBasic / 30) * unpaidLeaveDays);

    // ➡️ ૩. સરકારી નિયમો મુજબ કપાતો (Statutory Compliances)
    const pfDeduction = Math.round(cleanBasic * 0.12); // EPF = 12% of Basic
    const ptDeduction = cleanBasic > 10000 ? 200 : 0; // PT = Flat ₹200 if basic > 10k

    // ➡️ ૪. ડાયનેમિક ટેક્સ સ્લેબ્સ ગણતરી (TDS)
    let tdsDeduction = 0;
    if (cleanBasic > 100000) {
      tdsDeduction = Math.round(cleanBasic * 0.20); // 20% Tax
    } else if (cleanBasic > 50000) {
      tdsDeduction = Math.round(cleanBasic * 0.10); // 10% Tax
    } else if (cleanBasic > 30000) {
      tdsDeduction = Math.round(cleanBasic * 0.05); // 5% Tax
    }

    // ૫. કુલ કપાત (Total Deductions)
    const totalDeductions = manualDeduction + pfDeduction + ptDeduction + tdsDeduction + leaveDeduction;
    const netSalary = Math.max(0, cleanBasic + cleanBonus - totalDeductions);

    // ૬. નવો પેરોલ ઓબ્જેક્ટ બનાવો
    const payroll = new Payroll({
      employeeId,
      companyId: finalCompanyId,
      basicSalary: cleanBasic,
      bonus: cleanBonus,
      deductions: totalDeductions,
      deduction: totalDeductions,
      netSalary,
      month,
      status: "PAID",
    });

    // ૭. સરકારી કપાતોનો રેકોર્ડ ડાયનેમિકલી સેવ કરો
    payroll.set("pf", pfDeduction, { strict: false });
    payroll.set("pt", ptDeduction, { strict: false });
    payroll.set("tds", tdsDeduction, { strict: false });
    payroll.set("leaveDeduction", leaveDeduction, { strict: false });
    payroll.set("leaveDays", unpaidLeaveDays, { strict: false });

    await payroll.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: `Payroll generated! PF: ₹${pfDeduction}, Tax: ₹${tdsDeduction}, Leave Cut: ₹${leaveDeduction}.`,
      payroll,
    });
  } catch (err) {
    console.error("Payroll generation error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================
// 🕒 BIOMETRIC SYNC
// =====================================
export const biometricSync = async (req, res) => {
  try {
    const { employeeId, checkIn, checkOut } = req.body;

    const totalHours =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);

    const attendance = await Attendance.create({
      employeeId,
      companyId: req.user.companyId,
      checkIn,
      checkOut,
      totalHours,
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 🧬 AI LEAVE PREDICTION
// =====================================
export const leavePrediction = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.params.id,
    });

    const totalLeaves = leaves.length;
    let prediction = "LOW";

    if (totalLeaves > 10) prediction = "HIGH";
    else if (totalLeaves > 5) prediction = "MEDIUM";

    res.json({
      employeeId: req.params.id,
      totalLeaves,
      prediction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================
// 📝 UPDATE LEAVE STATUS
// =====================================
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    await Timeline.create({
      employee: leave.employeeId,
      action: `Leave request updated to ${status} by Admin`,
      companyId: req.user.companyId || null,
    });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};