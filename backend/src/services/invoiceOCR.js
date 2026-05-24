import Tesseract from "tesseract.js";

export const extractInvoiceText =
  async (imagePath) => {

    try {

      const result =
        await Tesseract.recognize(
          imagePath,
          "eng"
        );

      return result.data.text;

    } catch (err) {

      console.log(err);

      return "OCR Failed";

    }

  };