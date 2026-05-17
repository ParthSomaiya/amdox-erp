import express from "express";
import {
  createAccount,
  getAccounts
} from "../controllers/accountController.js";

import {
  createJournalEntry,
  getJournalEntries
} from "../controllers/journalController.js";

const router = express.Router();

// GL Accounts
router.post("/accounts", createAccount);
router.get("/accounts", getAccounts);

// Journal
router.post("/journal", createJournalEntry);
router.get("/journal", getJournalEntries);

export default router;