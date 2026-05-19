import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { sendNotification } from "../../../utils/notify.js";

export const createTask = async (
  req,
  res
) => {

  try {

    const task =
      await Task.create(req.body);

    // 🔥 SEND REALTIME NOTIFICATION
    await sendNotification({

      userId:
        task.assignedTo,

      title:
        "New Task Assigned",

      message:
        `Task "${task.title}" assigned to you`,

    });

    res.status(201).json(task);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

export const getTasks = async (req, res) => {
  const { projectId } = req.query;

  const data = await Task.find({
    projectId,
    companyId: req.user.companyId,
  }).populate("assignedTo", "name");

  res.json(data);
};

export const updateTaskStatus = async (req, res) => {
  const { id, status } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json(task);
};

// 💰 Budget tracking (hours → cost)
export const logHours = async (req, res) => {
  const { taskId, hours, costPerHour } = req.body;

  const task = await Task.findById(taskId);

  task.hours = (task.hours || 0) + hours;
  await task.save();

  const cost = hours * costPerHour;

  await Project.findByIdAndUpdate(task.projectId, {
    $inc: { spent: cost },
  });

  res.json({ message: "Hours logged & budget updated" });
};