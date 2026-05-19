import Permission from "../models/Permission.js";
import { PERMISSIONS } from "../../../config/permissions.js";

export const seedPermissions = async () => {
  try {
    // ADMIN
    await Permission.updateOne(
      { role: "ADMIN" },
      {
        permissions: Object.values(PERMISSIONS),
      },
      { upsert: true }
    );

    // FINANCE
    await Permission.updateOne(
      { role: "FINANCE" },
      {
        permissions: [
          PERMISSIONS.CREATE_INVOICE,
          PERMISSIONS.VIEW_FINANCE,
          PERMISSIONS.VIEW_ANALYTICS,
        ],
      },
      { upsert: true }
    );

    // HR
    await Permission.updateOne(
      { role: "HR" },
      {
        permissions: [
          PERMISSIONS.MANAGE_EMPLOYEES,
          PERMISSIONS.MANAGE_PAYROLL,
        ],
      },
      { upsert: true }
    );

    console.log("✅ Permissions seeded");
  } catch (err) {
    console.log("Permission seed error", err);
  }
};