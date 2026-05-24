export const attachCompany = (req, res, next) => {
  if (!req.user.companyId) {
    return res.status(400).json({ message: "No company assigned" });
  }

  req.companyId = req.user.companyId;
  next();
};

const tenantMiddleware = (
  req,
  res,
  next
) => {

  if (!req.user.companyId) {

    return res.status(403).json({
      message:
        "Company access denied",
    });

  }

  req.companyId =
    req.user.companyId;

  next();

};

export default tenantMiddleware;
