import Invoice from "../models/Invoice.js";

export const getTaxReport =
  async (req, res) => {

    const invoices =
      await Invoice.find({
        companyId:
          req.user.companyId,
      });

    const totalGST =
      invoices.reduce(

        (acc, inv) =>
          acc + inv.gstAmount,

        0
      );

    res.json({
      totalInvoices:
        invoices.length,

      totalGST,
    });

};