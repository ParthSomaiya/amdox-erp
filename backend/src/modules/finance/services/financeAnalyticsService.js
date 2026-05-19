export const calculateFinanceAnalytics = (invoices) => {
  let totalRevenue = 0;
  let totalGST = 0;
  let totalInvoices = invoices.length;

  invoices.forEach((inv) => {
    const amount = inv.amount || 0;
    const gst = inv.gst || 0;

    totalRevenue += amount;

    // GST FIX EDGE CASE (0, undefined, null safe)
    totalGST += amount * (gst / 100 || 0);
  });

  return {
    totalRevenue,
    totalGST,
    totalInvoices,
  };
};