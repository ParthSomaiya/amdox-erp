import express from "express";
import {
  getEmployees,
  updateEmployee,
  deactivateEmployee,
  changeRole,
} from "../controllers/employeeController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.post("/invite", authMiddleware, inviteEmployee);


router.get(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_EMPLOYEES),
  getEmployees
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.EDIT_EMPLOYEE),
  updateEmployee
);

router.put(
  "/deactivate/:id",
  authMiddleware,
  checkPermission(PERMISSIONS.EDIT_EMPLOYEE),
  deactivateEmployee
);

router.put(
  "/role",
  authMiddleware,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  changeRole
);

export default router;