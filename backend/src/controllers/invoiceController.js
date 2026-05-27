export const downloadInvoice =
  async (req, res) => {

    try {

      res.json({
        success: true,
        message: "Invoice Download",
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });

    }

  };