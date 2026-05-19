import Leave from "../models/Leave.js";

// APPROVE LEAVE (WORKFLOW FIX)
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      { status: "APPROVED" },
      { new: true }
    );

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REJECT LEAVE
export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      { status: "REJECTED" },
      { new: true }
    );

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};