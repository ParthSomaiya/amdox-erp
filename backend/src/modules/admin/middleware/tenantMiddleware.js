export const tenantMiddleware = (req, res, next) => {
  const companyId = req.user?.companyId;

  if (!companyId) {
    return res.status(403).json({ message: "No tenant access" });
  }

  req.companyId = companyId;
  next();
};