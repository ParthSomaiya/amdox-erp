import Product from "../models/Product.js";
import bwipjs from "bwip-js";
import QRCode from "qrcode";

import {
  predictReorder,
} from "../services/reorderAI.js";

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


// =========================
// GENERATE BARCODE
// =========================

export const generateBarcode =
  async (req, res) => {

    try {

      const {
        productId,
      } = req.params;

      const product =
        await Product.findById(productId);

      if (!product) {

        return res.status(404).json({
          message: "Product not found",
        });

      }

      const barcode =
        `AMD-${Date.now()}`;

      product.barcode = barcode;

      await product.save();

      bwipjs.toBuffer({

        bcid: "code128",

        text: barcode,

        scale: 3,

        height: 10,

        includetext: true,

      }, (err, png) => {

        if (err) {

          return res.status(500).json({
            message: err.message,
          });

        }

        res.set("Content-Type", "image/png");

        res.send(png);

      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};

export const autoReorder =
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

      const reorderList =
        products.map((p) => ({

          product:
            p.name,

          currentStock:
            p.stock,

          suggestedOrder:
            p.lowStockLimit * 5,

        }));

      res.json(reorderList);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};

export const generateQRCode =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          message: "Product not found",
        });

      }

      const qrData = {

        product:
          product.name,

        stock:
          product.stock,

        barcode:
          product.barcode,

      };

      const qr =
        await QRCode.toDataURL(
          JSON.stringify(qrData)
        );

      product.qrCode = qr;

      await product.save();

      res.json({
        qr,
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


export const reorderPrediction =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          companyId:
            req.user.companyId,

        });

      const result =
        products.map((p) => ({

          product:
            p.name,

          ...predictReorder(p),

        }));

      res.json(result);

    } catch (err) {

      res.status(500).json({

        message:
          err.message,

      });

    }

  };