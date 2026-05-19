// GST CALCULATION (FINAL FIXED)
export const calculateGST = (amount, gstRate) => {
  if (!amount || !gstRate) return 0;

  if (gstRate < 0 || gstRate > 100) return 0;

  const gst = (amount * gstRate) / 100;
  const cgst = gst / 2;
  const sgst = gst / 2;

  return {
    amount,
    gstRate,
    gst,
    cgst,
    sgst,
    total: amount + gst,
  };
};