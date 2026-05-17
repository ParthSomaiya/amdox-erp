export const checkPermission = (perm) => {
  return (req, res, next) => {
    const userPerms = req.user.permissions || [];

    if (!userPerms.includes(perm)) {
      return res.status(403).json({ message: "No permission" });
    }

    next();
  };
};