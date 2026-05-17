import Tenant from "../models/Tenant.js";

export const createTenant = async (req, res) => {
  const tenant = await Tenant.create(req.body);
  res.json(tenant);
};

export const getTenants = async (req, res) => {
  const data = await Tenant.find();
  res.json(data);
};