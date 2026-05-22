import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

// Add Employee (Admin / HR)
export const addEmployee = async (req, res) => {
  const { userId, position, salary } = req.body;

  const employee = await Employee.create({
    userId,
    position,
    salary,
    companyId: req.user.companyId,
    joiningDate: new Date(),
  });

  res.json(employee);
};

// Get Employees
export const getEmployees = async (req, res) => {
  const employees = await Employee.find({
    companyId: req.user.companyId,
  }).populate("userId");

  res.json(employees);
};

// Apply Leave (Employee)
export const applyLeave = async (req, res) => {
  const { fromDate, toDate, reason } = req.body;

  const leave = await Leave.create({
    employeeId: req.user.id,
    companyId: req.user.companyId,
    fromDate,
    toDate,
    reason,
  });

  res.json(leave);
};

// Approve / Reject Leave (HR)
export const updateLeaveStatus = async (req, res) => {
  const { leaveId, status } = req.body;

  const leave = await Leave.findByIdAndUpdate(
    leaveId,
    { status },
    { new: true }
  );

  res.json(leave);
};

// Get Leaves
export const getLeaves = async (req, res) => {
  const leaves = await Leave.find({
    companyId: req.user.companyId,
  });

  res.json(leaves);
};