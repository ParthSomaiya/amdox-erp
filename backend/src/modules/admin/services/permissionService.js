import Permission from "../models/Permission.js";

export const seedPermissions = async () => {
  const permissions = [
    { name: "CREATE_INVOICE", module: "FINANCE" },
    { name: "VIEW_INVOICE", module: "FINANCE" },
    { name: "APPROVE_LEAVE", module: "HR" },
    { name: "CREATE_PRODUCT", module: "SUPPLY" },
  ];

  for (let p of permissions) {
    await Permission.updateOne(
      { name: p.name },
      p,
      { upsert: true }
    );
  }

  console.log("✅ Permissions seeded");
};