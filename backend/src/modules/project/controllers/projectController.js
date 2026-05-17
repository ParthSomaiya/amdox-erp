import Project from "../modules/project/models/Project.js";
import Task from "../models/Task.js";

// Create Project
export const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
};

// Dashboard (Budget vs Actual)
export const getProjectDashboard = async (req, res) => {
  const projects = await Project.find();

  const data = await Promise.all(
    projects.map(async (p) => {
      const tasks = await Task.find({ projectId: p._id });

      const actualCost = tasks.reduce((sum, t) => sum + t.cost, 0);

      return {
        name: p.name,
        budget: p.budget,
        actualCost,
      };
    })
  );

  res.json(data);
};