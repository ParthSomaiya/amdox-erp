export const calculateGST = (amount, rate = 18) => {
  const gst = (amount * rate) / 100;

  return {
    cgst: gst / 2,
    sgst: gst / 2,
    total: amount + gst,
  };
};