import Role from "../models/Role.js";

export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      const role = await Role.findById(user.roleId)
        .populate("permissions");

      const hasPermission = role.permissions.some(
        (p) => p.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Permission error" });
    }
  };
};