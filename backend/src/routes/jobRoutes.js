import express from "express";
import { authorize } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobs,
  applyJob,
  getApplicants,
  updateApplicantStatus,
} from "../controllers/jobController.js";
import upload from "../config/multer.js"; // 🔹 તમારા મલ્ટર કન્ફિગનો ઉપયોગ કર્યો
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// JOBS MODULE ROUTES
// =========================

// ૧. નવી જોબ વેકેન્સી એડ કરવા માટે (ADMIN/HR)
router.post("/", authMiddleware, createJob);

// ૨. તમામ ઉપલબ્ધ જોબ્સ જોવા માટે (Public for Portal)
router.get("/", getJobs);

// =========================
// CANDIDATE APPLY ROUTE
// =========================

// ૩. ઉમેદવાર રેઝ્યુમે ફાઇલ સાથે જોબ એપ્લાય કરી શકે (Public)
router.post("/apply/:jobId", upload.single("resume"), applyJob);

// =========================
// APPLICANTS MANAGEMENT ROUTES (HR/ADMIN)
// =========================

// ૪. તમામ જોબ એપ્લિકન્ટ્સ જોવા માટે
router.get("/applicants", authMiddleware, getApplicants);

// ૫. ઉમેદવારનું સ્ટેટસ અપ્રુવ/રીજેક્ટ કરવા માટે
router.put("/applicant/:id", authMiddleware, updateApplicantStatus);

// ૬. ઇન્ટરવ્યુ શેડ્યૂલ લોગ કરવા માટે
router.post(
  "/interview",
  authMiddleware,
  async (req, res) => {
    res.json({
      message: "Interview Scheduled",
      data: req.body,
    });
  }
);

export default router;