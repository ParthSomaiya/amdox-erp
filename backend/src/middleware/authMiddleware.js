import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =============================
// PROTECT ROUTE (AUTH CHECK)
// =============================

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid",
      });
    }

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account disabled",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// =============================
// ALIAS (BACKWARD COMPATIBILITY)
// =============================

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// =============================
// ROLE BASED ACCESS CONTROL
// =============================

export const authorize =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied for this role",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Role authorization failed",
      });
    }
  };

// =============================
// ALIAS (YOUR OLD CODE SUPPORT)
// =============================

export const allowRoles = authorize;
export const authorizeRoles = authorize;