import Notification
from "../models/Notification.js";

import nodemailer
from "nodemailer";


// ==============================
// CREATE NOTIFICATION
// ==============================

export const createNotification =
  async (req, res) => {

    try {

      const notification =
        await Notification.create({

          userId:
            req.body.userId,

          title:
            req.body.title,

          message:
            req.body.message,

          type:
            req.body.type,

          link:
            req.body.link,
        });

      res.json(notification);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};


// ==============================
// GET USER NOTIFICATIONS
// ==============================

export const getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          userId:
            req.user._id,

        }).sort({
          createdAt: -1,
        });

      res.json(notifications);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};


// ==============================
// MARK SINGLE READ
// ==============================

export const markRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findByIdAndUpdate(

          req.params.id,

          {
            isRead: true,
          },

          { new: true }

        );

      res.json(notification);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};


// ==============================
// MARK ALL READ
// ==============================

export const markAllRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {
          userId:
            req.user._id,
        },

        {
          isRead: true,
        }

      );

      res.json({
        message:
          "All notifications marked as read",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};


// ==============================
// DELETE NOTIFICATION
// ==============================

export const deleteNotification =
  async (req, res) => {

    try {

      await Notification.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Notification deleted",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};


// ==============================
// EMAIL NOTIFICATION
// ==============================

export const sendEmailNotification =
  async (req, res) => {

    try {

      const transporter =
        nodemailer.createTransport({

          service: "gmail",

          auth: {
            user:
              process.env.SMTP_EMAIL,

            pass:
              process.env.SMTP_PASSWORD,
          },
        });

      await transporter.sendMail({

        from:
          process.env.SMTP_EMAIL,

        to:
          req.body.email,

        subject:
          req.body.subject,

        text:
          req.body.message,
      });

      res.json({
        message:
          "Email sent successfully",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

};