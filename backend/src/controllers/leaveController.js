import Leave from "../models/Leave.js";

import { sendNotification }
from "../utils/notify.js";

import {
  predictLeaveRisk,
} from "../services/aiLeavePrediction.js";


// ================= APPLY LEAVE =================

export const applyLeave =
  async (req, res) => {

    try {

      const {

        leaveType,

        fromDate,

        toDate,

        reason,

      } = req.body;

      if (
        !fromDate ||
        !toDate ||
        !reason
      ) {

        return res.status(400).json({

          message:
            "All fields are required",

        });

      }

      const from =
        new Date(fromDate);

      const to =
        new Date(toDate);

      if (from > to) {

        return res.status(400).json({

          message:
            "From date cannot be greater than To date",

        });

      }

      const leave =
        await Leave.create({

          employeeId:
            req.user._id,

          companyId:
            req.user.companyId,

          leaveType,

          fromDate,

          toDate,

          reason,

          status:
            "PENDING",

        });

      res.status(201).json({

        success: true,

        message:
          "Leave applied successfully",

        leave,

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          "Error applying leave",

      });

    }

  };


// ================= GET ALL LEAVES =================

export const getAllLeaves =
  async (req, res) => {

    try {

      const leaves =
        await Leave.find({

          companyId:
            req.user.companyId,

        })

          .populate(
            "employeeId",
            "name email role"
          )

          .sort({
            createdAt: -1,
          });

      res.json(leaves);

    } catch (err) {

      res.status(500).json({

        message:
          "Error fetching leaves",

      });

    }

  };


// ================= GET MY LEAVES =================

export const getMyLeaves =
  async (req, res) => {

    try {

      const leaves =
        await Leave.find({

          employeeId:
            req.user._id,

          companyId:
            req.user.companyId,

        }).sort({
          createdAt: -1,
        });

      res.json(leaves);

    } catch (err) {

      res.status(500).json({

        message:
          "Error fetching my leaves",

      });

    }

  };


// ================= UPDATE LEAVE STATUS =================

export const updateLeaveStatus =
  async (req, res) => {

    try {

      const {

        leaveId,

        status,

      } = req.body;

      if (
        !leaveId ||
        !status
      ) {

        return res.status(400).json({

          message:
            "Leave ID and status required",

        });

      }

      const leave =
        await Leave.findOneAndUpdate(

          {

            _id: leaveId,

            companyId:
              req.user.companyId,

          },

          {

            status,

          },

          {

            new: true,

          }

        );

      if (!leave) {

        return res.status(404).json({

          message:
            "Leave not found",

        });

      }

      await sendNotification(

        leave.employeeId,

        `Your leave request is ${status}`,

        "LEAVE",

        req.user.companyId

      );

      res.json({

        success: true,

        message:
          `Leave ${status}`,

        leave,

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        message:
          "Error updating leave",

      });

    }

  };


// ================= AI PREDICTION =================

export const getLeavePrediction =
  async (req, res) => {

    try {

      const data =
        await predictLeaveRisk(
          req.params.id
        );

      res.json(data);

    } catch (err) {

      res.status(500).json({

        message:
          err.message,

      });

    }

  };