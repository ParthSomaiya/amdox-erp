import PDFDocument from "pdfkit";
import Payroll from "../models/Payroll.js";
import User from "../models/User.js";
import { sendNotification } from "../utils/notify.js";
import { emailQueue } from "../queues/emailQueue.js";

// ================= UTILITY =================
const toNumber = (val) => {
  return Number(val || 0);
};

// ➕ GENERATE PAYROLL
export const generatePayroll = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      bonus,
      deductions,
      month,
    } = req.body;

    // ================= VALIDATION =================
    if (!employeeId || !month) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and Month are required",
      });
    }

    // ================= CALCULATION =================
    const netSalary =
      toNumber(basicSalary) +
      toNumber(bonus) -
      toNumber(deductions);

    // ================= CREATE PAYROLL =================
    const payroll = await Payroll.create({
      employeeId,
      companyId: req.user.companyId,
      month,
      basicSalary: toNumber(basicSalary),
      bonus: toNumber(bonus),
      deductions: toNumber(deductions),
      netSalary,
    });

    // ================= GET USER =================
    const user = await User.findById(employeeId);

    // ================= EMAIL QUEUE =================
    if (user?.email) {
      await emailQueue.add("sendEmail", {
        to: user.email,
        subject: "Payslip Generated",
        html: `
          <div style="font-family:Arial">
            <h2>Payslip Generated</h2>
            <p>Hello ${user.name || "Employee"},</p>
            <p>Your payroll for <b>${month}</b> has been generated successfully.</p>
            <hr/>
            <p><b>Net Salary:</b> ₹${netSalary}</p>
            <p>Thank you.</p>
          </div>
        `,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });

  } catch (err) {
    console.error("Generate Payroll Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate payroll",
    });
  }
};

// 💰 MARK AS PAID
export const markPaid = async (req, res) => {
  try {
    const { payrollId } = req.body;

    if (!payrollId) {
      return res.status(400).json({
        success: false,
        message: "Payroll ID required",
      });
    }

    const payroll = await Payroll.findOneAndUpdate(
      {
        _id: payrollId,
        companyId: req.user.companyId,
      },
      {
        status: "PAID",
      },
      {
        new: true,
      }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    // ================= NOTIFICATION =================
    await sendNotification(
      payroll.employeeId,
      "Salary credited successfully",
      "PAYROLL",
      req.user.companyId
    );

    return res.json({
      success: true,
      message: "Payroll marked as paid",
      data: payroll,
    });

  } catch (err) {
    console.error("Mark Paid Error:", err);

    return res.status(500).json({
      success: false,
      message: "Error marking payroll as paid",
    });
  }
};

// 📋 GET ALL PAYROLL
export const getAllPayroll = async (req, res) => {
  try {
    const data = await Payroll.find({
      companyId: req.user.companyId,
    }).populate("employeeId", "name email");

    return res.json({
      success: true,
      count: data.length,
      data,
    });

  } catch (err) {
    console.error("Get Payroll Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payroll data",
    });
  }
};

// 👤 MY PAYROLL
export const getMyPayroll = async (req, res) => {
  try {
    const data = await Payroll.find({
      employeeId: req.user.id,
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: data.length,
      data,
    });

  } catch (err) {
    console.error("My Payroll Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payroll",
    });
  }
};

// 📄 DOWNLOAD PAYSLIP (PDF)
export const downloadPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate("employeeId");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip-${payroll._id}.pdf`
    );

    doc.pipe(res);

    // ================= PDF CONTENT =================
    doc.fontSize(22).text("PAYSLIP", { align: "center" });
    doc.moveDown();

    doc.fontSize(14);
    doc.text(`Employee: ${payroll.employeeId?.name || "N/A"}`);
    doc.text(`Email: ${payroll.employeeId?.email || "N/A"}`);
    doc.text(`Month: ${payroll.month}`);
    doc.moveDown();

    doc.text(`Basic Salary: ₹${payroll.basicSalary}`);
    doc.text(`Bonus: ₹${payroll.bonus}`);
    doc.text(`Deductions: ₹${payroll.deductions}`);
    doc.moveDown();

    doc.fontSize(16).text(`Net Salary: ₹${payroll.netSalary}`, {
      underline: true,
    });

    doc.end();

  } catch (err) {
    console.error("Download Payslip Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to generate payslip",
    });
  }
};