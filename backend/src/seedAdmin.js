import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

await mongoose.connect("mongodb://localhost:27017/amdox-erp");

const hashed = await bcrypt.hash("admin123", 10);

await User.create({
  name: "Admin",
  email: "admin@amdox.com",
  password: hashed,
  role: "ADMIN",
  isVerified: true,
});

console.log("Admin created");
process.exit();