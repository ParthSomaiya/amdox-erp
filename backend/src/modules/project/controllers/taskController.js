import Task from "../models/Task.js";
import { sendNotification } from "../../../utils/notify.js";

// CREATE TASK
export const createTask = async (
  req,
  res
) => {

  try {

    const task =
      await Task.create(req.body);

    // 🔥 REALTIME NOTIFICATION
    if (task.assignedTo) {

      await sendNotification({

        userId:
          task.assignedTo,

        title:
          "New Task Assigned",

        message:
          `Task "${task.title}" assigned to you`,

      });

    }

    res.status(201).json(task);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// GET TASKS
export const getTasksByProject =
async (req, res) => {

  try {

    const tasks =
      await Task.find({
        projectId:
          req.params.projectId,
      });

    res.json(tasks);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// UPDATE STATUS
export const updateTaskStatus =
async (req, res) => {

  try {

    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        {
          status:
            req.body.status,
        },
        {
          new: true,
        }
      );

    res.json(task);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// GANTT TIMELINE
export const getTimeline =
async (req, res) => {

  try {

    const tasks =
      await Task.find({
        projectId:
          req.params.projectId,
      });

    res.json(tasks);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};