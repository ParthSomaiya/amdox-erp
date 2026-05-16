import EmployeeLifecycle from "../models/EmployeeLifecycle.js";

export const updateLifecycle = async (req, res) => {
  try {
    const { employeeId, status, designation, salary } = req.body;

    const data = await EmployeeLifecycle.findOneAndUpdate(
      {
        employeeId,
        companyId: req.user.companyId,
      },
      {
        status,
        designation,
        salary,
        ...(status === "EXITED" && { exitedAt: new Date() }),
      },
      { new: true, upsert: true }
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lifecycle error" });
  }
};

export const getLifecycle = async (req, res) => {
  const data = await EmployeeLifecycle.find({
    companyId: req.user.companyId,
  }).populate("employeeId", "name email");

  res.json(data);
};