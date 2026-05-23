import PDFDocument from "pdfkit";

export const generateInvoicePDF = (
  invoice,
  res
) => {

  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `inline; filename=${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(22).text(
    "GST INVOICE",
    {
      align: "center",
    }
  );

  doc.moveDown();

  doc.fontSize(14).text(
    `Invoice No: ${invoice.invoiceNumber}`
  );

  doc.text(
    `Customer: ${invoice.customerName}`
  );

  doc.text(
    `GST: ${invoice.gstAmount}`
  );

  doc.text(
    `Total: ₹${invoice.totalAmount}`
  );

  doc.moveDown();

  invoice.items.forEach((item) => {

    doc.text(
      `${item.name} - ${item.quantity} x ₹${item.price}`
    );

  });

  doc.end();

};