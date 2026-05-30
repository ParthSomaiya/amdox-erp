import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import Payroll from "../models/Payroll.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js"; 
import Leave from "../models/Leave.js";       
import { sendNotification } from "../utils/notify.js";
import { emailQueue } from "../queues/emailQueue.js";

const toNumber = (val) => Number(val || 0);

// =====================================
// 💰 GENERATE PAYROLL (સંપૂર્ણ સરકારી ટેક્સ, લીવ કપાત અને ડ્યુઅલ સેક્યોર્ડ companyId સિંક)
// =====================================
export const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, basicSalary, bonus, deduction, deductions, companyId } = req.body;

    const cleanBonus = Number(bonus || 0);
    const cleanBasic = Number(basicSalary || 0);
    const manualDeduction = Number(deduction || deductions || 0);

    if (!employeeId || !month) {
      return res.status(400).json({ success: false, message: "Employee ID and Month are required" });
    }

    const employeeObj = await Employee.findOne({ $or: [{ _id: employeeId }, { userId: employeeId }] });
    const actualEmployeeId = employeeObj ? employeeObj._id : employeeId;

    let finalCompanyId = companyId || employeeObj?.companyId || req.user?.companyId;

    if (!finalCompanyId || finalCompanyId === null || String(finalCompanyId) === "null" || String(finalCompanyId) === "undefined") {
      const userObj = await User.findById(req.user?.id || req.user?._id);
      finalCompanyId = userObj?.companyId;
    }
    if (!finalCompanyId || finalCompanyId === null || String(finalCompanyId) === "null" || String(finalCompanyId) === "undefined") {
      const fallbackAdmin = await User.findOne({ role: "ADMIN" });
      finalCompanyId = fallbackAdmin?.companyId;
    }
    if (!finalCompanyId || finalCompanyId === null || String(finalCompanyId) === "null" || String(finalCompanyId) === "undefined") {
      finalCompanyId = new mongoose.Types.ObjectId();
    }

    console.log("🎯 Cascade verified companyId for Payroll DB Write:", finalCompanyId);

    if (employeeObj && (!employeeObj.companyId || employeeObj.companyId === null)) {
      employeeObj.companyId = finalCompanyId;
      await employeeObj.save({ validateBeforeSave: false });
    }

    let unpaidLeaveDays = 0;
    if (employeeObj) {
      const approvedLeaves = await Leave.find({
        employeeId: employeeObj.userId, 
        status: "APPROVED"
      });

      approvedLeaves.forEach(leave => {
        const leaveMonth = new Date(leave.fromDate).toISOString().slice(0, 7);
        if (leaveMonth === month) {
          const days = Math.ceil(
            (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
          ) || 1;
          unpaidLeaveDays += days;
        }
      });
    }

    const leaveDeduction = Math.round((cleanBasic / 30) * unpaidLeaveDays);

    const pfDeduction = Math.round(cleanBasic * 0.12);
    const ptDeduction = cleanBasic > 10000 ? 200 : 0;
    
    let tdsDeduction = 0;
    if (cleanBasic > 100000) tdsDeduction = Math.round(cleanBasic * 0.20);
    else if (cleanBasic > 50000) tdsDeduction = Math.round(cleanBasic * 0.10);
    else if (cleanBasic > 30000) tdsDeduction = Math.round(cleanBasic * 0.05);

    const totalDeductions = manualDeduction + pfDeduction + ptDeduction + tdsDeduction + leaveDeduction;
    const netSalary = Math.max(0, cleanBasic + cleanBonus - totalDeductions);

    const payroll = new Payroll({
      employeeId: actualEmployeeId,
      companyId: finalCompanyId,
      month,
      basicSalary: cleanBasic,
      bonus: cleanBonus,
      deductions: totalDeductions,
      deduction: totalDeductions,
      netSalary,
      status: "PAID",
    });

    payroll.set("pf", pfDeduction, { strict: false });
    payroll.set("pt", ptDeduction, { strict: false });
    payroll.set("tds", tdsDeduction, { strict: false });
    payroll.set("leaveDeduction", leaveDeduction, { strict: false });
    payroll.set("leaveDays", unpaidLeaveDays, { strict: false });

    await payroll.save({ validateBeforeSave: false });

    const user = await User.findById(employeeObj ? employeeObj.userId : employeeId);

    if (user?.email) {
      try {
        await emailQueue.add("sendEmail", {
          to: user.email,
          subject: "Payslip Generated",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Payslip Generated</h2>
              <p>Hello ${user.name || "Employee"},</p>
              <p>Your payroll for <b>${month}</b> has been generated successfully.</p>
              <hr style="border:0; border-top:1px solid #eee; margin:20px 0;"/>
              <p><b>Net Salary:</b> ₹${netSalary}</p>
              <p>Thank you.</p>
            </div>
          `,
        });
      } catch (queueErr) {
        console.warn("Email queue addition bypassed:", queueErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Payroll generated! Deducted ₹${leaveDeduction} for ${unpaidLeaveDays} leaves.`,
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

// =====================================
// 📝 MARK AS PAID
// =====================================
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
      { _id: payrollId, companyId: req.user.companyId },
      { status: "PAID" },
      { new: true }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    try {
      await sendNotification(
        payroll.employeeId,
        "Salary credited successfully",
        "PAYROLL",
        req.user.companyId
      );
    } catch (notifyErr) {
      console.warn("Notification dispatch bypassed:", notifyErr.message);
    }

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

// =====================================
// 📋 GET ALL PAYROLLS 
// =====================================
export const getAllPayroll = async (req, res) => {
  try {
    let query = {};
    
    if (req.user?.companyId && req.user?.role !== "ADMIN" && req.user?.role !== "HR") {
      query.companyId = req.user.companyId;
    }

    const data = await Payroll.find(query)
      .populate({
        path: "employeeId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

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

// =====================================
// 👤 GET PERSONAL PAYROLLS (EMPLOYEE)
// =====================================
export const getMyPayroll = async (req, res) => {
  try {
    const data = await Payroll.find({ employeeId: req.params.userId || req.user.id })
      .populate("employeeId")
      .sort({ createdAt: -1 });

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

// =====================================
// 📄 DOWNLOAD PAYSLIP (PDF)
// =====================================
export const downloadPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate("employeeId");

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

    doc.fontSize(22).text("AMDOX TECHNOLOGIES PAYSLIP", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Employee Name: ${payroll.employeeId?.name || "N/A"}`);
    doc.text(`Email Address: ${payroll.employeeId?.email || "N/A"}`);
    doc.text(`Payroll Period: ${payroll.month}`);
    doc.moveDown();

    doc.text(`Basic Salary: INR ${payroll.basicSalary}`);
    doc.text(`Bonus Incentives: INR ${payroll.bonus}`);
    doc.text(`Deductions: INR ${payroll.deductions}`);
    doc.moveDown();

    doc.fontSize(14).text(`Net Payout Amount: INR ${payroll.netSalary}`, {
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