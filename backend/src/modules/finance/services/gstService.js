export const calculateGST = (amount, gstRate) => {
  if (!amount || !gstRate) return 0;

  if (gstRate < 0 || gstRate > 100) return 0;

  return amount * (gstRate / 100);
};