import Job from "../models/Job.js";

// 👨‍💼 HR/Admin create job
export const createJob = async (req, res) => {
  try {
    const { title, description, skills } = req.body;

    const job = await Job.create({
      title,
      description,
      skills,
      companyId: req.user.companyId,
    });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error creating job" });
  }
};

// 🌍 Public jobs list
export const getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};