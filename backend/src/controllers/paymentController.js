import stripe from "../config/stripe.js";

// ================= CREATE PAYMENT =================

export const createPayment =
  async (req, res) => {

    try {

      const session =
        await stripe.checkout.sessions.create({

          payment_method_types: ["card"],

          line_items: [

            {
              price_data: {

                currency: "inr",

                product_data: {
                  name: "Invoice Payment",
                },

                unit_amount:
                  req.body.amount * 100,

              },

              quantity: 1,

            },

          ],

          mode: "payment",

          success_url:
            "http://localhost:5173/success",

          cancel_url:
            "http://localhost:5173/cancel",

        });

      res.json({
        url: session.url,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message,
      });

    }

};