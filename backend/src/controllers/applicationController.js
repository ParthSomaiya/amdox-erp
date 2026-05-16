import Application from "../models/Application.js";

// 🧑 Job seeker apply
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const app = await Application.create({
      jobId,
      userId: req.user.id,
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Apply error" });
  }
};

// 👨‍💼 HR view applicants
export const getApplicants = async (req, res) => {
  const apps = await Application.find()
    .populate("userId", "email")
    .populate("jobId", "title");

  res.json(apps);
};