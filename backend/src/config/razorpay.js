import razorpay
  from "../config/razorpay.js";

// create razopay

export const createRazorpayOrder =
  async (req, res) => {

    const options = {

      amount:
        req.body.amount * 100,

      currency: "INR",

      receipt:
        "receipt_order",
    };

    const order =
      await razorpay.orders.create(
        options
      );

    res.json(order);

};