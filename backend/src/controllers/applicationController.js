import Application from "../models/Application.js";

export const applyJob = async (req, res) => {
  try {
    const app = await Application.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      experience: Number(req.body.experience || 0),
      skills: req.body.skills,
      portfolio: req.body.portfolio,
      resume: req.file?.path,
      jobId: req.body.jobId,
      position: req.body.position,
      status: "PENDING"
    });

    res.json(app);
  } catch (err) {
    console.error("Apply Controller Error:", err);
    res.status(500).json({ message: "Apply error" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const data = await Application.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};