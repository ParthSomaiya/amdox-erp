import Application from "../models/Application.js";

export const applyJob = async (req, res) => {
  const app = await Application.create({
    jobId: req.body.jobId,
    userId: req.user.id,
    resume:
      req.file.path,
    companyId: req.companyId
  });

  res.json(app);
};

// HR view applicants
export const getApplicants = async (req, res) => {
  const apps = await Application.find({
    companyId: req.companyId
  })
    .populate("jobId")
    .populate("userId");

  res.json(apps);
};

// ATS pipeline update
export const updateStatus = async (req, res) => {
  const app = await Application.findById(req.params.id);

  app.status = req.body.status;
  await app.save();

  res.json(app);
};