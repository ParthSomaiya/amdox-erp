export const attachCompany = (req, res, next) => {
  if (!req.user.companyId) {
    return res.status(400).json({ message: "No company assigned" });
  }

  req.companyId = req.user.companyId;
  next();
};