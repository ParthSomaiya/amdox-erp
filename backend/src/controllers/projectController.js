import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    companyId: req.user.companyId,
  });

  res.json(project);
};

export const getProjects = async (req, res) => {
  const data = await Project.find({
    companyId: req.user.companyId,
  });

  res.json(data);
};

// 📊 Project stats (tasks + progress)
export const getProjectDetails = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  const tasks = await Task.find({ projectId: id });

  const completed = tasks.filter(t => t.status === "DONE").length;

  res.json({
    project,
    totalTasks: tasks.length,
    completedTasks: completed,
    progress: tasks.length
      ? Math.round((completed / tasks.length) * 100)
      : 0,
  });
};