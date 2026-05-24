import Task from "../models/Task.js";

// ======================================
// BUILD GANTT TREE
// ======================================

export const buildGanttData =
  async (projectId) => {

    const tasks =
      await Task.find({
        projectId,
      });

    return tasks.map((task) => ({

      id:
        task._id.toString(),

      name:
        task.title,

      start:
        new Date(task.startDate),

      end:
        new Date(task.endDate),

      progress:
        task.progress || 0,

      dependencies:
        task.dependencies || [],

      type:
        "task",

    }));

  };


// ======================================
// UPDATE DEPENDENCIES
// ======================================

export const updateTaskDependency =
  async (
    taskId,
    dependencies
  ) => {

    return await Task.findByIdAndUpdate(

      taskId,

      {
        dependencies,
      },

      {
        new: true,
      }

    );

  };