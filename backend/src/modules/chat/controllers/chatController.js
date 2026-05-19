import Message
from "../models/Message.js";

// GET ROOM MESSAGES
export const getMessages =
  async (req, res) => {

    try {

      const messages =
        await Message.find({

          room:
            req.params.room,

        })

        .populate(
          "sender",
          "name email"
        )

        .sort({
          createdAt: 1,
        });

      res.json(messages);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};