import Permission
from "../models/Permission.js";

export const checkPermission =
  (permission) => {
    return async (
      req,
      res,
      next
    ) => {
      try {

        const role =
          req.user.role;

        const rolePermissions =
          await Permission.findOne({
            role,
          });

        if (
          !rolePermissions
        ) {
          return res
            .status(403)
            .json({
              message:
                "No permissions",
            });
        }

        const allowed =
          rolePermissions.permissions.includes(
            permission
          );

        if (!allowed) {
          return res
            .status(403)
            .json({
              message:
                "Access denied",
            });
        }

        next();

      } catch (err) {
        console.log(err);

        res.status(500).json({
          message:
            "Permission error",
        });
      }
    };
  };