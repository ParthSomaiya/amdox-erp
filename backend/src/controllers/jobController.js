import Job from "../models/Job.js";
import Applicant from "../models/Applicant.js";


// =========================
// CREATE JOB
// =========================

export const createJob = async (req, res) => {
  try {

    const job = await Job.create({

      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      salary: req.body.salary,
      type: req.body.type,

      status: req.body.status || "OPEN",

      companyId: req.user.companyId,

    });

    res.status(201).json(job);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// GET ALL JOBS
// =========================

export const getJobs = async (req, res) => {
  try {

    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// GET SINGLE JOB
// =========================

export const getSingleJob = async (req, res) => {
  try {

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {

      return res.status(404).json({
        message: "Job not found",
      });

    }

    res.json(job);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// UPDATE JOB
// =========================

export const updateJob = async (req, res) => {
  try {

    const job = await Job.findByIdAndUpdate(

      req.params.id,

      {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        salary: req.body.salary,
        type: req.body.type,
        status: req.body.status,
      },

      { new: true }

    );

    res.json(job);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// DELETE JOB
// =========================

export const deleteJob = async (req, res) => {
  try {

    await Job.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Job deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// APPLY JOB
// =========================

export const applyJob = async (req, res) => {
  try {

    const applicant = await Applicant.create({

      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,

      experience:
        req.body.experience,

      skills: req.body.skills,

      jobId: req.params.jobId,

      resume:
        req.file?.path || "",

      status: "APPLIED",

    });

    res.status(201).json(applicant);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// GET APPLICANTS
// =========================

export const getApplicants = async (req, res) => {
  try {

    const applicants =
      await Applicant.find()

        .populate(
          "jobId",
          "title location"
        )

        .sort({
          createdAt: -1,
        });

    res.json(applicants);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// =========================
// GET SINGLE APPLICANT
// =========================

export const getSingleApplicant =
  async (req, res) => {

    try {

      const applicant =
        await Applicant.findById(
          req.params.id
        ).populate("jobId");

      if (!applicant) {

        return res.status(404).json({
          message:
            "Applicant not found",
        });

      }

      res.json(applicant);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// =========================
// UPDATE APPLICANT STATUS
// =========================

export const updateApplicantStatus =
  async (req, res) => {

    try {

      const applicant =
        await Applicant.findByIdAndUpdate(

          req.params.id,

          {
            status:
              req.body.status,

            interviewDate:
              req.body.interviewDate,
          },

          { new: true }

        );

      res.json(applicant);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// =========================
// DELETE APPLICANT
// =========================

export const deleteApplicant =
  async (req, res) => {

    try {

      await Applicant.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Applicant deleted",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};