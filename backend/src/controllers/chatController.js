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


// ==========================
// REACT MESSAGE
// ==========================

export const reactMessage =
  async (req, res) => {

    try {

      const { emoji } = req.body;

      const message =
        await Message.findById(
          req.params.id
        );

      message.reactions.push({

        userId: req.user._id,
        emoji,

      });

      await message.save();

      res.json(message);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// ==========================
// EDIT MESSAGE
// ==========================

export const editMessage =
  async (req, res) => {

    try {

      const message =
        await Message.findById(
          req.params.id
        );

      message.editHistory.push({

        oldMessage:
          message.message,

        editedAt:
          new Date(),

      });

      message.message =
        req.body.message;

      message.edited = true;

      await message.save();

      res.json(message);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// ==========================
// DELETE MESSAGE
// ==========================

export const deleteMessage =
  async (req, res) => {

    try {

      const message =
        await Message.findById(
          req.params.id
        );

      message.deletedForEveryone = true;

      message.message =
        "Message Deleted";

      await message.save();

      res.json({
        message: "Deleted",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};