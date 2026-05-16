import Application from "../models/Application.js";

export const applyJob = async (req, res) => {
  try {
    const app = await Application.create({
      name: req.body.name,
      email: req.body.email,
      resume: req.file?.path,
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Apply error" });
  }
};

export const getApplications = async (req, res) => {
  const data = await Application.find().sort({ createdAt: -1 });
  res.json(data);
};

export const updateStatus = async (req, res) => {
  const { id, status } = req.body;

  const updated = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json(updated);
};