import bcrypt from "bcryptjs";

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
// 👨‍💼 EMPLOYEES
// =====================================
export const addEmployee = async (req, res) => {
  try {
    const { userId, position, salary } = req.body;

    const employee = await Employee.create({
      userId,
      position,
      salary,
      companyId: req.user.companyId,
      joiningDate: new Date(),
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// 🔹 GET LEAVES (This was causing the SyntaxError!)
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

// =====================================
// 👤 GET MY LEAVES (EMPLOYEE PORTAL)
// =====================================
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

// =====================================
// 📊 GET MY LEAVE BALANCE (DYNAMIC DOCK)
// =====================================
export const getLeaveBalance = async (req, res) => {
  try {
    let balance = await LeaveBalance.findOne({
      employeeId: req.user.id,
    });

    // જો કોઈ કર્મચારીનું બેલેન્સ રેકોર્ડ હજુ સુધી ન બન્યું હોય, તો ડિફોલ્ટ ક્રિએટ કરો
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
    const { employeeId, month, basicSalary, bonus, deduction, deductions } = req.body;

    const cleanDeduction = Number(deduction || deductions || 0);
    const cleanBonus = Number(bonus || 0);
    const cleanBasic = Number(basicSalary || 0);

    if (employeeId) {
      const netSalary = cleanBasic + cleanBonus - cleanDeduction;

      const payroll = await Payroll.create({
        employeeId,
        companyId: req.user.companyId,
        basicSalary: cleanBasic,
        bonus: cleanBonus,
        deductions: cleanDeduction,
        deduction: cleanDeduction,
        netSalary,
        month,
        status: "PAID",
      });

      return res.json({
        success: true,
        message: "Payroll generated successfully for employee",
        payroll,
      });
    }

    const employees = await Employee.find({
      companyId: req.user.companyId,
    });

    const payrolls = [];

    for (const emp of employees) {
      const empBasic = emp.salary || 30000;
      const empBonus = 2000;
      const empDeductions = 1000;
      const netSalary = empBasic + empBonus - empDeductions;

      const payroll = await Payroll.create({
        employeeId: emp.userId,
        companyId: req.user.companyId,
        basicSalary: empBasic,
        bonus: empBonus,
        deductions: empDeductions,
        deduction: empDeductions,
        netSalary,
        month: month || new Date().toISOString().slice(0, 7),
        status: "PAID",
      });

      payrolls.push(payroll);
    }

    return res.json({
      success: true,
      message: "Batch payroll generated successfully for all employees",
      payrolls,
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

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  await Timeline.create({
    employee: leave.employeeId,
    action: `Leave request updated to ${status} by Admin`,
    companyId: req.user.companyId,
  });
};

// =====================================
// ➕ CREATE EMPLOYEE (ADMIN/HR)
// =====================================
export const createEmployee = async (req, res) => {
  try {
    const { name, email, position } = req.body;

    if (!name || !email || !position) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ૧. ડુપ્લીકેટ યુઝર ચેક
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An employee with this email already exists.",
      });
    }

    // ૨. પાસવર્ડને Bcrypt દ્વારા સેફ હેશ (Encrypt) કરો (આનાથી લોગિન પ્રોબ્લેમ સોલ્વ થશે!)
    const hashedPassword = await bcrypt.hash("password123", 10);

    // ૩. User મોડેલમાં હેશ કરેલા પાસવર્ડ સાથે રેકોર્ડ બનાવો
    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword, // અહિયાં હેશ પાસવર્ડ સેવ થશે
      role: "EMPLOYEE",
      companyId: req.user?.companyId || null,
      isVerified: true,
    });

    // ૪. Employee મોડેલમાં રેકોર્ડ બનાવો
    const newEmployee = await Employee.create({
      userId: newUser._id,
      position,
      companyId: req.user?.companyId || null,
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