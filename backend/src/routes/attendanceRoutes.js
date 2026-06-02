import express from "express";
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// બધી રિકવેસ્ટ પ્રોટેક્ટેડ હોવાથી કોમન ઓર્થ મિડલવેર
router.use(authMiddleware);

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/my", getMyAttendance);
router.get("/", allowRoles("HR", "ADMIN"), getAllAttendance);

export default router;