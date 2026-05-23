import Product from "../models/Product.js";

export const createProduct =
  async (req, res) => {

    try {

      const product =
        await Product.create(req.body);

      res.json(product);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};

export const getProducts =
  async (req, res) => {

    const products =
      await Product.find();

    res.json(products);

};

// ================= LOW STOCK PRODUCTS =================

export const getLowStockProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          $expr: {
            $lte: [
              "$stock",
              "$lowStockLimit",
            ],
          },

        });

      res.json(products);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};