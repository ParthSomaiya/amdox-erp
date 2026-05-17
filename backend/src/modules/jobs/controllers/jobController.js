import Job from "../models/Job.js";


// 🔹 Public Job List
export const getPublicJobs = async (req, res) => {
  const jobs = await Job.find({ isPublic: true })
    .populate("company", "name");

  res.json(jobs);
};


// 🔹 Company Jobs (Career Page)
export const getCompanyJobs = async (req, res) => {
  const { companyId } = req.params;

  const jobs = await Job.find({ company: companyId });

  res.json(jobs);
};


// 🔹 Create Job (Admin)

export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    companyId: req.companyId
  });

  res.json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find({ isActive: true });
  res.json(jobs);
};