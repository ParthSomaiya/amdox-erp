import Task from "../models/Task.js";


// LOG TIME
export const logTime =
  async (req, res) => {

    try {

      const {
        taskId,
        hours,
      } = req.body;

      const task =
        await Task.findById(taskId);

      task.loggedHours += Number(hours);

      await task.save();

      res.json(task);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};