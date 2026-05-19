export const calculateGST =
  (
    amount,
    gstRate
  ) => {

    const gst =
      (amount * gstRate) / 100;

    const cgst =
      gst / 2;

    const sgst =
      gst / 2;

    return {

      amount,

      gstRate,

      gst,

      cgst,

      sgst,

      total:
        amount + gst,
    };
  };