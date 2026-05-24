import Project from "../models/Project.js";
import Task from "../models/Task.js";
import {
  buildGanttData,
} from "../services/ganttService.js";


// =========================
// CREATE PROJECT
// =========================

export const createProject =
  async (req, res) => {

    try {

      const project =
        await Project.create({

          ...req.body,

          companyId:
            req.user.companyId,

        });

      res.json(project);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };


// =========================
// GET PROJECTS
// =========================

export const getProjects =
  async (req, res) => {

    const projects =
      await Project.find()
        .populate("members");

    res.json(projects);

  };


// =========================
// CREATE TASK
// =========================

export const createTask =
  async (req, res) => {

    const task =
      await Task.create(req.body);

    res.json(task);

  };


// =========================
// GET TASKS
// =========================

export const getTasks =
  async (req, res) => {

    const tasks =
      await Task.find({
        projectId:
          req.params.projectId,
      }).populate(
        "assignedTo"
      );

    res.json(tasks);

  };


// =========================
// UPDATE TASK STATUS
// =========================

export const updateTaskStatus =
  async (req, res) => {

    const task =
      await Task.findByIdAndUpdate(

        req.params.id,

        {
          status:
            req.body.status,
        },

        { new: true }

      );

    res.json(task);

  };


// =========================
// PROJECT ANALYTICS
// =========================

export const projectAnalytics =
  async (req, res) => {

    const totalProjects =
      await Project.countDocuments();

    const totalTasks =
      await Task.countDocuments();

    const completedTasks =
      await Task.countDocuments({
        status: "DONE",
      });

    const pendingTasks =
      await Task.countDocuments({
        status: "TODO",
      });

    res.json({

      totalProjects,

      totalTasks,

      completedTasks,

      pendingTasks,

    });

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


export const getGanttTasks =
  async (req, res) => {

    try {

      const data =
        await buildGanttData(
          req.query.projectId
        );

      res.json(data);

    } catch (err) {

      res.status(500).json({

        message:
          err.message,

      });

    }

  };