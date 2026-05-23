import Sprint from "../models/Sprint.js";


// CREATE SPRINT
export const createSprint =
  async (req, res) => {

    try {

      const sprint =
        await Sprint.create(req.body);

      res.json(sprint);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// GET SPRINTS
export const getSprints =
  async (req, res) => {

    try {

      const sprints =
        await Sprint.find({
          projectId:
            req.params.projectId,
        });

      res.json(sprints);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};