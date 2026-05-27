export const allowRoles =
  (...roles) => {

    return (
      req,
      res,
      next
    ) => {

      try {

        if (
          !roles.includes(req.user.role)
        ) {

          return res.status(403).json({

            success: false,

            message:
              "Insufficient permissions",

          });

        }

        next();

      } catch (error) {

        console.log(error);

        res.status(500).json({

          success: false,

          message:
            "Role middleware error",

        });

      }

    };

  };

export const authorizeRoles =
  (...roles) =>
  allowRoles(...roles);