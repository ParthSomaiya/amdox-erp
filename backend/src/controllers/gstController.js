import Invoice from "../models/Invoice.js";

// gstreport

export const gstReport =
  async (req, res) => {

    const invoices =
      await Invoice.find({
        companyId:
          req.user.companyId,
      });

    let totalGST = 0;

    invoices.forEach((i) => {

      totalGST +=
        i.gstAmount || 0;

    });

    res.json({
      totalInvoices:
        invoices.length,

      totalGST,
    });

};