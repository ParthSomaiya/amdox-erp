import express from "express";
import crypto from "crypto";

import {
  addEmployee,
  getEmployees,
  applyLeave,
  updateLeaveStatus,
  getLeaves,
} from "../controllers/hrController.js";

import Invite from "../models/Invite.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/invite/:token", async (req, res) => {
  const invite = await Invite.findOne({ token: req.params.token });

  if (!invite || invite.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired invite" });
  }

  res.json(invite);
});

router.post("/invite", async (req, res) => {
  const { email, role } = req.body;

  const token = crypto.randomBytes(20).toString("hex");

  await Invite.create({
    email,
    role,
    companyId: req.user.companyId,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  const inviteLink = `http://localhost:5173/invite/${token}`;

  console.log("Invite Link:", inviteLink);

  res.json({ message: "Invite sent" });
});

router.post("/register-invite", async (req, res) => {
  const { token, password } = req.body;

  const invite = await Invite.findOne({ token });

  if (!invite) {
    return res.status(400).json({ message: "Invalid invite" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: invite.email,
    password: hashed,
    role: invite.role,
    companyId: invite.companyId,
  });

  await Invite.deleteOne({ token });

  res.json({ message: "Account created via invite" });
});

// Employee Management
router.post("/add", protect, authorizeRoles("ADMIN", "HR"), addEmployee);
router.get("/", protect, authorizeRoles("ADMIN", "HR"), getEmployees);

// Leave
router.post("/leave", protect, authorizeRoles("EMPLOYEE"), applyLeave);
router.get("/leave", protect, authorizeRoles("HR"), getLeaves);
router.put("/leave", protect, authorizeRoles("HR"), updateLeaveStatus);

export default router;