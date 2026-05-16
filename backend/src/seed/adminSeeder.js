import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  const exists = await User.findOne({ role: "ADMIN" });

  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@erp.com",
      password: hashed,
      role: "ADMIN",
    });

    console.log("Admin created");
  }
};