import Permission from "../models/Permission.js";

export const PERMISSIONS = [
  "CREATE_INVOICE",
  "VIEW_ANALYTICS",
  "MANAGE_USERS",
  "MANAGE_PAYROLL",
  "MANAGE_PROJECTS",
  "MANAGE_TASKS",
  "VIEW_REPORTS",
  "MANAGE_FINANCE",
];

export const seedPermissions = async () => {
  try {

    for (const permissionName of PERMISSIONS) {

      // skip invalid names
      if (!permissionName) continue;

      await Permission.updateOne(
        { name: permissionName },
        {
          $set: {
            name: permissionName,
          },
        },
        {
          upsert: true,
        }
      );
    }

    console.log("✅ Permissions Seeded");

  } catch (err) {

    console.log("❌ Permission Seeder Error:", err.message);

  }
};