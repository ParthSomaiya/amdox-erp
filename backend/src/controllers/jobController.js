import Job from "../models/Job.js";
import Applicant from "../models/Applicant.js"; // 🔹 તમારા મોડેલ મુજબ 'Applicant' ઉપયોગ કર્યો
import { parseResume } from "../utils/resumeParser.js";
import { sendInterviewMail } from "../utils/sendInterviewMail.js";

// =========================
// CREATE JOB (HR/ADMIN)
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
      companyId: req.user?.companyId || null, // એડમિન કંપની આઈડી મેપિંગ
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// GET ALL JOBS (PUBLIC / CAREER PORTAL)
// =========================
export const getJobs = async (req, res) => {
  try {
    let jobs = await Job.find().sort({ createdAt: -1 });

    // જો ડેટાબેઝ ખાલી હોય તો આપમેળે રિયલ-ટાઇમ રિક્રુટમેન્ટ જોબ્સ સીડ કરો
    if (jobs.length === 0) {
      jobs = await Job.create([
        {
          title: "Frontend Developer (React/Vite)",
          description: "Responsible for building responsive, premium ERP layouts using React 18, Tailwind CSS, and Recharts. Integration with REST APIs is required.",
          location: "Ahmedabad",
          salary: 65000,
          type: "FULL_TIME"
        },
        {
          title: "Backend Engineer (Node/NestJS)",
          description: "Design robust REST APIs, manage double-entry ledger databases on Postgres, and configure Redis job queues via BullMQ.",
          location: "Remote",
          salary: 85000,
          type: "REMOTE"
        },
        {
          title: "UI/UX Designer",
          description: "Create interactive user story mappings, clean wireframes, and high-fidelity mockups for our enterprise accounting suite.",
          location: "Ahmedabad",
          salary: 45000,
          type: "INTERNSHIP"
        }
      ]);
    }

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
    const job = await Job.findById(req.params.id);
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
    await Job.findByIdAndDelete(req.params.id);
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
// APPLY JOB (CANDIDATE WITH RESUME PARSER)
// =========================

export const applyJob = async (req, res) => {
  try {
    const { name, email, phone, experience, skills, portfolio } = req.body;
    let parsed = null;
    
    if (req.file && req.file.path) {
      try {
        parsed = await parseResume(req.file.path);
      } catch (parseErr) {
        console.error("Resume parsing warning:", parseErr.message);
      }
    }

    // 🔹 ડાયનેમિક કેન્ડિડેટ પેરામીટર્સ ક્રિએશન
    const applicant = await Applicant.create({
      name,
      email,
      phone: phone || "N/A",
      experience: Number(experience || 0),
      skills: skills || "",
      portfolio: portfolio || "",
      jobId: req.params.jobId || req.params.id, 
      resume: req.file ? req.file.path : "uploads/sample_resume.pdf",
      parsedData: parsed,
    });

    res.status(201).json({ success: true, message: "Application Submitted", applicant });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: "Application Failed: " + err.message });
  }
};

// =========================
// GET APPLICANTS (HR/ADMIN WITH AUTO SEEDING)
// =========================
export const getApplicants = async (req, res) => {
  try {
    let applicants = await Applicant.find()
      .populate("jobId", "title location")
      .sort({ createdAt: -1 });

    // જો કોઈ અરજી ન આવી હોય, તો ડેમો માટે ઓટો-સીડ એપ્લિકન્ટ બનાવો જેથી પેજ ખાલી ન દેખાય
    if (applicants.length === 0) {
      const sampleJob = await Job.findOne() || await Job.create({
        title: "Frontend Developer (React/Vite)",
        description: "ERP UI Building",
        location: "Ahmedabad"
      });

      await Applicant.create([
        { jobId: sampleJob._id, name: "Arjun Mehta", email: "arjun@gmail.com", resume: "uploads/sample_resume.pdf", status: "PENDING" },
        { jobId: sampleJob._id, name: "Krina Patel", email: "krina@gmail.com", resume: "uploads/sample_resume.pdf", status: "ACCEPTED" }
      ]);

      applicants = await Applicant.find().populate("jobId", "title location").sort({ createdAt: -1 });
    }

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
export const getSingleApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate("jobId");
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
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
// UPDATE APPLICANT STATUS & INTERVIEW EMAIL
// =========================
export const updateApplicantStatus = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        interviewDate: req.body.interviewDate,
      },
      { new: true }
    );

    // જો ઇન્ટરવ્યુ ડેટ સેટ થાય તો ઓટોમેટિકલી ઇમેઇલ મોકલો
    if (req.body.interviewDate && applicant) {
      try {
        await sendInterviewMail(applicant.email, req.body.interviewDate);
      } catch (mailErr) {
        console.error("Interview mail send error:", mailErr.message);
      }
    }

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
export const deleteApplicant = async (req, res) => {
  try {
    await Applicant.findByIdAndDelete(req.params.id);
    res.json({
      message: "Applicant deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};