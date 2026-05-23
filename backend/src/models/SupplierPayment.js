import mongoose from "mongoose";

const supplierPaymentSchema =
  new mongoose.Schema({

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    amount: Number,

    paymentDate: Date,

    paymentMethod: String,

    referenceNo: String,

  },

  { timestamps: true }

);

export default mongoose.model(
  "SupplierPayment",
  supplierPaymentSchema
);