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

// Get Tasks (Upgraded with Auto-Seeding)
export const getTasks = async (req, res) => {
  try {
    let tasks = await Task.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    if (tasks.length === 0) {
      const today = new Date();
      tasks = await Task.create([
        {
          title: "Setup Monorepo Structure",
          description: "Configure Turborepo and pnpm workspaces inside the root folder",
          priority: "HIGH",
          status: "DONE",
          startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
          companyId: req.user.companyId
        },
        {
          title: "Integrate Plaid Balance API",
          description: "Connect finance modules to bank transfer endpoints for reconciliation",
          priority: "MEDIUM",
          status: "IN_PROGRESS",
          startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
          companyId: req.user.companyId
        },
        {
          title: "Deploy Helm Charts",
          description: "Verify Kubernetes manifests and Ingress rules on AWS EKS",
          priority: "LOW",
          status: "TODO",
          startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
          companyId: req.user.companyId
        }
      ]);
    }

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
export const logHours = async (req, res) => {
  try {
    const { taskId, hours } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.loggedHours = (task.loggedHours || 0) + Number(hours);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};