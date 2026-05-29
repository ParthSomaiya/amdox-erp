import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      companyId: req.user.companyId,
      title,
      description: description || "",
      priority: priority || "MEDIUM",
      status: status || "TODO",
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Task Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description, priority } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (priority) updateFields.priority = priority;

    const task = await Task.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      { $set: updateFields },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ success: false, message: err.message });
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