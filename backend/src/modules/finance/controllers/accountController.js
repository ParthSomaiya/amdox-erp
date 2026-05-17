import Account from "../models/Account.js";

export const createAccount = async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAccounts = async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
};