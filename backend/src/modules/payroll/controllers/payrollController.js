import PDFDocument from "pdfkit";
import Payroll from "../models/Payroll.js";
import User from "../models/User.js";
import { sendNotification } from "../utils/notify.js";
import { emailQueue } from "../queues/emailQueue.js";


// ➕ Generate Payroll
export const generatePayroll =
async (req, res) => {

  try {

    const {
      employeeId,
      basicSalary,
      bonus,
      deductions,
      month,
    } = req.body;

    const netSalary =
      basicSalary +
      bonus -
      deductions;

    // CREATE PAYROLL
    const payroll =
      await Payroll.create({

        employeeId,

        companyId:
          req.user.companyId,

        month,

        basicSalary,

        bonus,

        deductions,

        netSalary,

      });

    // 🔥 GET USER (IMPORTANT FIX)
    const user =
      await User.findById(
        employeeId
      );

    // 🔥 EMAIL QUEUE (ASYNC)
    if (user) {

      await emailQueue.add(

        "sendEmail",

        {

          to:
            user.email,

          subject:
            "Payslip Generated",

          html: `

            <h2>Payslip Ready</h2>

            <p>
              Your payroll for ${month}
              has been generated.
            </p>

            <p>
              Net Salary: ${netSalary}
            </p>

          `,

        }

      );

    }

    res.json(payroll);

  } catch (err) {

    res.status(500).json({
      message:
        err.message,
    });

  }

};


// 💰 Mark Paid
export const markPaid =
async (req, res) => {

  try {

    const {
      payrollId,
    } = req.body;

    const payroll =
      await Payroll.findOneAndUpdate(

        {
          _id: payrollId,

          companyId:
            req.user.companyId,
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
        message:
          "Payroll not found",
      });

    }

    await sendNotification(

      payroll.employeeId,

      "Salary credited",

      "PAYROLL",

      req.user.companyId

    );

    res.json(payroll);

  } catch (err) {

    res.status(500).json({
      message:
        "Error marking paid",
    });

  }

};


// 📋 All Payroll
export const getAllPayroll =
async (req, res) => {

  const data =
    await Payroll.find({

      companyId:
        req.user.companyId,

    }).populate(
      "employeeId",
      "email"
    );

  res.json(data);

};


// 👤 My Payroll
export const getMyPayroll =
async (req, res) => {

  const data =
    await Payroll.find({

      employeeId:
        req.user.id,

      companyId:
        req.user.companyId,

    });

  res.json(data);

};

export const downloadPayslip = async (req, res) => {
  const payroll = await Payroll.findById(req.params.id)
    .populate("employeeId");

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=payslip.pdf"
  );

  doc.pipe(res);

  doc.fontSize(20).text("PAYSLIP", { align: "center" });
  doc.moveDown();

  doc.text(`Employee: ${payroll.employeeId.name}`);
  doc.text(`Month: ${payroll.month}`);
  doc.text(`Basic: ${payroll.basicSalary}`);
  doc.text(`Bonus: ${payroll.bonus}`);
  doc.text(`Deductions: ${payroll.deductions}`);
  doc.text(`Net Salary: ${payroll.netSalary}`);

  doc.end();
};