export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Role middleware error" });
    }
  };
};

export const authorizeRoles =
  (...roles) => {

    return (req, res, next) => {

      if (
        !roles.includes(req.user.role)
      ) {

        return res.status(403).json({
          message:
            "Access denied",
        });

      }

      next();
    };

  };