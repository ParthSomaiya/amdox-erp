import PDFDocument from "pdfkit";
import fs from "fs";

export const generateAuditReport =
  async (data) => {

    const doc =
      new PDFDocument();

    const fileName =
      `audit-report-${Date.now()}.pdf`;

    const path =
      `uploads/${fileName}`;

    doc.pipe(
      fs.createWriteStream(path)
    );

    doc.fontSize(24)
      .text(
        "CA Audit Report"
      );

    doc.moveDown();

    data.forEach((item) => {

      doc.fontSize(14)
        .text(
          `${item.account} - ₹${item.amount}`
        );

    });

    doc.end();

    return path;

  };