import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Invite from "../models/Invite.js";
import crypto from "crypto";


// ➕ Add Employee (Admin/HR)
export const addEmployee = async (req, res) => {
  try {
    const { name, email, position, salary } = req.body;

    // create user
    const user = await User.create({
      name,
      email,
      password: "123456", // later OTP सिस्टम use करो
      role: "EMPLOYEE",
      companyId: req.user.companyId,
    });

    // create employee profile
    const employee = await Employee.create({
      userId: user._id,
      position,
      salary,
      companyId: req.user.companyId,
    });

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error adding employee" });
  }
};

// 📋 Get all employees (HR/Admin)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      companyId: req.user.companyId,
    }).populate("userId", "name email");

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// 👤 Get single employee
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    }).populate("userId", "name email");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee" });
  }
};

// ✏️ Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      req.body,
      { new: true }
    );

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee" });
  }
};

// ❌ Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};

// 👑 Admin add employee (invite)
export const inviteEmployee = async (req, res) => {
  try {
    const { email, role } = req.body;

    const token = crypto.randomBytes(20).toString("hex");

    const invite = await Invite.create({
      email,
      role,
      companyId: req.user.companyId,
      token,
    });

    const inviteLink = `http://localhost:5173/register/employee/${token}`;

    // TODO: send email here (nodemailer)
    console.log("Invite Link:", inviteLink);

    res.json({
      message: "Invite sent",
      inviteLink,
    });
  } catch (err) {
    res.status(500).json({ message: "Invite error" });
  }
};