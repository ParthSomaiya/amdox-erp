import { ROLE_PERMISSIONS }
from "../config/rolePermissions.js";

export const checkPermission =
  (...requiredPermissions) => {

    return (
      req,
      res,
      next
    ) => {

      try {

        const role =
          req.user.role;

        const permissions =
          ROLE_PERMISSIONS[role] || [];

        const allowed =
          requiredPermissions.every(
            (perm) =>
              permissions.includes(perm)
          );

        if (!allowed) {

          return res.status(403).json({
            message:
              "Permission denied",
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