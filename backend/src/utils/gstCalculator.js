export const calculateGST = (
  amount,
  rate = 18
) => {
  const gst =
    (amount * rate) / 100;

  return {
    gst,
    total: amount + gst,
  };
};