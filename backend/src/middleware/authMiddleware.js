import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= AUTH / PROTECT =================

export const protect = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        message: "No token provided",
      });

    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {

      return res.status(401).json({
        message: "User not found",
      });

    }

    req.user = {
      id: user._id,
      role: user.role,
      companyId: user.companyId,
      email: user.email,
      name: user.name,
    };

    next();

  } catch (err) {

    console.log(err);

    res.status(401).json({
      message: "Invalid token",
    });

  }

};

// SAME EXPORT
export const authMiddleware = protect;

// ================= ROLE AUTH =================

export const authorize = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({
        message: "Unauthorized",
      });

    }

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied",
      });

    }

    next();

  };

};