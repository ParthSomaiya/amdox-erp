import express from "express";

import {

  applyLeave,

  getAllLeaves,

  updateLeaveStatus,

  getMyLeaves,

  getLeavePrediction,

} from "../controllers/leaveController.js";

import {

  authMiddleware,

} from "../middleware/authMiddleware.js";

import {

  allowRoles,

} from "../middleware/roleMiddleware.js";

const router =
  express.Router();


// ========================================
// EMPLOYEE APPLY LEAVE
// ========================================

router.post(

  "/apply",

  authMiddleware,

  allowRoles(
    "EMPLOYEE",
    "HR",
    "ADMIN"
  ),

  applyLeave

);


// ========================================
// EMPLOYEE / USER MY LEAVES
// ========================================

router.get(

  "/my",

  authMiddleware,

  allowRoles(
    "EMPLOYEE",
    "HR",
    "ADMIN"
  ),

  getMyLeaves

);


// ========================================
// HR / ADMIN VIEW ALL LEAVES
// ========================================

router.get(

  "/",

  authMiddleware,

  allowRoles(
    "HR",
    "ADMIN"
  ),

  getAllLeaves

);


// ========================================
// HR / ADMIN UPDATE LEAVE STATUS
// ========================================

router.put(

  "/update",

  authMiddleware,

  allowRoles(
    "HR",
    "ADMIN"
  ),

  updateLeaveStatus

);


// ========================================
// AI LEAVE PREDICTION
// ========================================

router.get(

  "/prediction/:id",

  authMiddleware,

  allowRoles(
    "HR",
    "ADMIN"
  ),

  getLeavePrediction

);


// ========================================
// EXPORT
// ========================================

export default router;