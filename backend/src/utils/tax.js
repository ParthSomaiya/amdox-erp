export const calculateGST = (amount, gstRate) => {
  const gst = (amount * gstRate) / 100;

  return {
    cgst: gst / 2,
    sgst: gst / 2,
    total: amount + gst,
  };
};