import Sprint from "../models/Sprint.js";
import Task from "../models/Task.js";

// ======================================
// VELOCITY CALCULATION
// ======================================

export const calculateSprintVelocity =
  async (projectId) => {

    const sprints =
      await Sprint.find({
        projectId,
      });

    let result = [];

    for (const sprint of sprints) {

      const tasks =
        await Task.find({

          sprintId:
            sprint._id,

          status:
            "DONE",

        });

      const completedPoints =
        tasks.reduce(
          (acc, task) =>
            acc +
            (task.storyPoints || 0),
          0
        );

      result.push({

        sprint:
          sprint.name,

        velocity:
          completedPoints,

      });

    }

    return result;

  };