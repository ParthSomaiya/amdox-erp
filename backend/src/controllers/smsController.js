import { smsQueue } from "../queues/smsQueue.js";

export const sendSMS =
  async (req, res) => {

    try {

      await smsQueue.add(

        "sendSMS",

        {

          to:
            req.body.to,

          message:
            req.body.message,

        }

      );

      res.json({

        success: true,

        message:
          "SMS Queued",

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message:
          err.message,

      });

    }

  };