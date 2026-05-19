import { createBackup } from "../services/backupService.js";

export const manualBackup = async (req, res) => {
  const file = await createBackup();
  res.json({ message: "Backup created", file });
};