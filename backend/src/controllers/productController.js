import Product from "../models/Product.js";
import { generateQRCode } from "../utils/qrGenerator.js";

export const createProduct =
  async (req, res) => {

    try {

      const qr =
        await generateQRCode(

          JSON.stringify({

            name:
              req.body.name,

            sku:
              req.body.sku,

          })

        );

      const product =
        await Product.create({

          ...req.body,

          companyId:
            req.user.companyId,

          qrCode: qr,

        });

      res.json(product);

    } catch (err) {

      res.status(500).json({

        message:
          err.message,

      });

    }

  };

export const getProducts = async (req, res) => {
  const data = await Product.find({ companyId: req.user.companyId });
  res.json(data);
};

export const getLowStock = async (req, res) => {
  const products = await Product.find({ stock: { $lt: 10 } });
  res.json(products);
};