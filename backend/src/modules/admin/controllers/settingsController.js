import SystemSetting from "../models/SystemSetting.js";

// GET SETTINGS
export const getSettings = async (req, res) => {
  const settings = await SystemSetting.find({
    companyId: req.user.companyId,
  });

  res.json(settings);
};

// UPDATE SETTINGS
export const updateSetting = async (req, res) => {
  const { key, value } = req.body;

  const setting = await SystemSetting.findOneAndUpdate(
    { companyId: req.user.companyId, key },
    { value },
    { upsert: true, new: true }
  );

  res.json(setting);
};