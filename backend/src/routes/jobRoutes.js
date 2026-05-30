import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // 🔹 સચોટ સિક્યોરિટી મિડલવેર ઈમ્પોર્ટ
import {
  createJob,
  getJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  applyJob,
  getApplicants,
  getSingleApplicant,
  updateApplicantStatus,
  deleteApplicant,
} from "../controllers/jobController.js";
import upload from "../config/multer.js"; // 🔹 તમારા મલ્ટર કન્ફિગનો ઉપયોગ કર્યો

const router = express.Router();

// =====================================
// JOBS MODULE ROUTES (ADMIN / HR)
// =====================================

// ૧. નવી જોબ વેકેન્સી એડ કરવા માટે
router.post("/", protect, authorizeRoles("ADMIN", "HR"), createJob);

// ૨. તમામ ઉપલબ્ધ જોબ્સ જોવા માટે (Public for Portal)
router.get("/", getJobs);

// ૩. સિંગલ જોબની વિગતો મેળવવા માટે
router.get("/:id", getSingleJob);

// ૪. જોબ વેકેન્સી અપડેટ કરવા માટે (All fields edit support)
router.put("/:id", protect, authorizeRoles("ADMIN", "HR"), updateJob);

// ૫. જોબ વેકેન્સી ડીલીટ કરવા માટે
router.delete("/:id", protect, authorizeRoles("ADMIN", "HR"), deleteJob);

// =====================================
// CANDIDATE APPLY ROUTE
// =====================================

// ૬. ઉમેદવાર રેઝ્યુમે ફાઇલ સાથે જોબ એપ્લાય કરી શકે (Public)
router.post("/apply/:jobId", upload.single("resume"), applyJob);

// =====================================
// APPLICANTS MANAGEMENT ROUTES (HR/ADMIN)
// =====================================

// ૭. તમામ જોબ એપ્લિકન્ટ્સ જોવા માટે
router.get("/applicants", protect, authorizeRoles("ADMIN", "HR"), getApplicants);

// ૮. સિંગલ એપ્લિકન્ટની વિગતો જોવા માટે
router.get("/applicant/:id", protect, authorizeRoles("ADMIN", "HR"), getSingleApplicant);

// ૯. ઉમેદવારનું સ્ટેટસ અપ્રુવ/રીજેક્ટ કરવા માટે
router.put("/applicant/:id", protect, authorizeRoles("ADMIN", "HR"), updateApplicantStatus);

// ૧૦. ઉમેદવારની અરજી ડીલીટ કરવા માટે
router.delete("/applicant/:id", protect, authorizeRoles("ADMIN", "HR"), deleteApplicant);

// ૧૧. ઇન્ટરવ્યુ શેડ્યૂલ લોગ કરવા માટે
router.post(
  "/interview",
  protect,
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    res.json({
      message: "Interview Scheduled",
      data: req.body,
    });
  }
);

export default router;