import PDFDocument from "pdfkit";
import Payroll from "../models/Payroll.js";

export const downloadPayslip = async (req, res) => {
  try {
    const { payrollId } = req.params;

    const payroll = await Payroll.findById(payrollId).populate(
      "employeeId",
      "name email"
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    const doc = new PDFDocument();

    // response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip-${payroll.month}.pdf`
    );

    doc.pipe(res);

    // 🧾 PDF content
    doc.fontSize(20).text("Amdox ERP - Payslip", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`Employee: ${payroll.employeeId.name}`);
    doc.text(`Email: ${payroll.employeeId.email}`);
    doc.text(`Month: ${payroll.month}`);

    doc.moveDown();
    doc.text(`Basic Salary: ₹${payroll.basicSalary}`);
    doc.text(`Bonus: ₹${payroll.bonus}`);
    doc.text(`Deductions: ₹${payroll.deductions}`);

    doc.moveDown();
    doc.fontSize(14).text(`Net Salary: ₹${payroll.netSalary}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "PDF generation error" });
  }
};