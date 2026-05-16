import { ROLE_PERMISSIONS } from "../config/rolePermissions.js";

export const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    next();
  };
};