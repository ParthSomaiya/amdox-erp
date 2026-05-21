import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const seedAdmin =
  async () => {

    try {

      const existingAdmin =
        await User.findOne({
          email:
            "admin@amdox.com",
        });

      if (existingAdmin) {

        console.log(
          "✅ Admin already exists"
        );

        return;

      }

      const hashedPassword =
        await bcrypt.hash(
          "admin123",
          10
        );

      await User.create({

        name:
          "Super Admin",

        email:
          "admin@amdox.com",

        password:
          hashedPassword,

        role:
          "ADMIN",

      });

      console.log(
        "✅ Default admin created"
      );

    } catch (err) {

      console.log(
        "❌ Seeder Error"
      );

      console.log(
        err.message
      );

    }

  };