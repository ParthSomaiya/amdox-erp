export const calculateGST =
  ({
    amount,
    gstPercent,
  }) => {

    const gst =
      (
        amount *
        gstPercent
      ) / 100;

    const total =
      amount + gst;

    return {

      baseAmount:
        amount,

      gst,

      total,

    };

  };

export const generateGSTReport =
  (invoices) => {

    let totalGST = 0;

    invoices.forEach(
      (invoice) => {

        totalGST +=
          invoice.gstAmount;

      }
    );

    return {

      totalInvoices:
        invoices.length,

      totalGST,

    };

  };