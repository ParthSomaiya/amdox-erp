import Task from "../modules/project/models/Task.js";

// Create Task
export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
};

// Kanban Tasks
export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({
    projectId: req.params.projectId,
  });

  res.json(tasks);
};

// Update Status (Drag Drop)
export const updateTaskStatus = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(task);
};

// Timeline (Gantt)
export const getTimeline = async (req, res) => {
  const tasks = await Task.find({
    projectId: req.params.projectId,
  });

  res.json(tasks); // frontend will render Gantt
};