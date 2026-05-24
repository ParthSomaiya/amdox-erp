import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";
import User from "../models/User.js";
import Payroll from "../models/Payroll.js";
import Timeline from "../models/Timeline.js";


export const getTimeline =
  async (req, res) => {

    try {

      const data =
        await Timeline.find()
          .populate(
            "employee",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.json(data);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };


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

export const approveLeave =
  async (req, res) => {

    try {

      const leave =
        await Leave.findById(
          req.params.id
        );

      if (!leave) {

        return res.status(404).json({
          message: "Leave not found",
        });

      }

      leave.status = "APPROVED";

      leave.history.push({
        status: "APPROVED",
        changedBy: req.user.id,
        changedAt: new Date(),
      });

      await leave.save();

      // deduct leave balance
      const balance =
        await LeaveBalance.findOne({
          employeeId:
            leave.employeeId,
        });

      if (balance) {

        balance.usedLeaves +=
          leave.days;

        balance.remainingLeaves -=
          leave.days;

        await balance.save();

      }

      res.json({
        message:
          "Leave approved",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };

export const rejectLeave =
  async (req, res) => {

    try {

      const leave =
        await Leave.findById(
          req.params.id
        );

      leave.status = "REJECTED";

      leave.history.push({
        status: "REJECTED",
        changedBy: req.user.id,
        changedAt: new Date(),
      });

      await leave.save();

      res.json({
        message:
          "Leave rejected",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };

export const hrAnalytics =
  async (req, res) => {

    try {

      const totalEmployees =
        await User.countDocuments({
          companyId:
            req.user.companyId,
        });

      const totalLeaves =
        await Leave.countDocuments({
          companyId:
            req.user.companyId,
        });

      res.json({

        totalEmployees,

        totalLeaves,

      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };


export const searchEmployees =
  async (req, res) => {

    try {

      const { search } = req.query;

      const employees =
        await User.find({

          companyId:
            req.user.companyId,

          name: {
            $regex: search,
            $options: "i",
          },

        });

      res.json(employees);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };


// ==============================
// AUTO GENERATE PAYROLL
// ==============================

export const generatePayroll =
  async (req, res) => {

    try {

      const employees =
        await Employee.find({
          companyId:
            req.user.companyId,
        });

      const payrolls = [];

      for (const emp of employees) {

        const basicSalary =
          emp.salary || 30000;

        const bonus = 2000;

        const deductions = 1000;

        const netSalary =
          basicSalary +
          bonus -
          deductions;

        const payroll =
          await Payroll.create({

            employeeId:
              emp.userId,

            companyId:
              req.user.companyId,

            basicSalary,

            bonus,

            deductions,

            netSalary,

            month:
              req.body.month,
          });

        payrolls.push(payroll);

      }

      res.json({
        message:
          "Payroll Generated",
        payrolls,
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };

// ==============================
// BIOMETRIC SYNC
// ==============================

export const biometricSync =
  async (req, res) => {

    try {

      const {
        employeeId,
        checkIn,
        checkOut,
      } = req.body;

      const totalHours =
        (
          new Date(checkOut) -
          new Date(checkIn)
        ) /
        (1000 * 60 * 60);

      const attendance =
        await Attendance.create({

          employeeId,

          companyId:
            req.user.companyId,

          checkIn,

          checkOut,

          totalHours,
        });

      res.json(attendance);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };

// ==============================
// AI LEAVE PREDICTION
// ==============================

export const leavePrediction =
  async (req, res) => {

    try {

      const leaves =
        await Leave.find({
          employeeId:
            req.params.id,
        });

      const totalLeaves =
        leaves.length;

      let prediction =
        "LOW";

      if (totalLeaves > 10) {
        prediction = "HIGH";
      } else if (
        totalLeaves > 5
      ) {
        prediction =
          "MEDIUM";
      }

      res.json({
        employeeId:
          req.params.id,

        totalLeaves,

        prediction,
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };