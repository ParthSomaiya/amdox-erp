import Chat from "../models/Chat.js";
import Message from "../models/Message.js";


// ==========================
// CREATE CHAT
// ==========================

export const createChat =
  async (req, res) => {

    try {

      const chat =
        await Chat.create({

          name: req.body.name,

          isGroup:
            req.body.isGroup,

          members:
            req.body.members,

          createdBy:
            req.user.id,
        });

      res.json(chat);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// ==========================
// GET USER CHATS
// ==========================

export const getChats =
  async (req, res) => {

    try {

      const chats =
        await Chat.find({

          members: req.user.id,

        }).populate(
          "members",
          "name email"
        );

      res.json(chats);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// ==========================
// SEND MESSAGE
// ==========================

export const sendMessage =
  async (req, res) => {

    try {

      const msg =
        await Message.create({

          chatId:
            req.body.chatId,

          sender:
            req.user.id,

          message:
            req.body.message,

          attachment:
            req.body.attachment,
        });

      const populated =
        await Message.findById(
          msg._id
        ).populate(
          "sender",
          "name email"
        );

      res.json(populated);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// ==========================
// GET CHAT MESSAGES
// ==========================

export const getMessages =
  async (req, res) => {

    try {

      const msgs =
        await Message.find({

          chatId:
            req.params.chatId,

        })
          .populate(
            "sender",
            "name email"
          )
          .sort({
            createdAt: 1,
          });

      res.json(msgs);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};