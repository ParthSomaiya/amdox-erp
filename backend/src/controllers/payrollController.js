import Payroll from "../models/Payroll.js";

// 👨‍💼 Generate Payroll
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

// 👨‍💼 Mark as paid
export const markPaid = async (req, res) => {
  const { payrollId } = req.body;

  const payroll = await Payroll.findByIdAndUpdate(
    payrollId,
    { status: "PAID" },
    { new: true }
  );

  res.json(payroll);
};

// 👨‍💼 HR/Admin view all
export const getAllPayroll = async (req, res) => {
  const data = await Payroll.find({
    companyId: req.user.companyId,
  }).populate("employeeId", "email");

  res.json(data);
};

// 👤 Employee view own
export const getMyPayroll = async (req, res) => {
  const data = await Payroll.find({
    employeeId: req.user.id,
  });

  res.json(data);
};