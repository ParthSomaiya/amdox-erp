import Task from "../models/Task.js";


// ==============================
// ➕ CREATE TASK
// ==============================

export const createTask =
  async (req, res) => {

    try {

      const task =
        await Task.create({

          ...req.body,

          companyId:
            req.user.companyId,

        });

      res.json(task);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };


// ==============================
// 📋 GET TASKS
// ==============================

export const getTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find({

          companyId:
            req.user.companyId,

        });

      res.json(tasks);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };


// ==============================
// 🔄 UPDATE STATUS
// ==============================

export const updateTaskStatus =
  async (req, res) => {

    try {

      const {
        taskId,
        status,
      } = req.body;

      const task =
        await Task.findByIdAndUpdate(

          taskId,

          { status },

          { new: true }

        );

      res.json(task);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };


// ==============================
// ⏱ LOG HOURS
// ==============================

export const logHours =
  async (req, res) => {

    try {

      const {
        taskId,
        hours,
      } = req.body;

      const task =
        await Task.findById(taskId);

      if (!task) {

        return res.status(404).json({
          message:
            "Task not found",
        });

      }

      task.loggedHours =
        (task.loggedHours || 0)
        + Number(hours);

      await task.save();

      res.json(task);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };