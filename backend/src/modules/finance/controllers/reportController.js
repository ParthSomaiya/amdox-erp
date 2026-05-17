import JournalEntry from "../models/JournalEntry.js";

export const getTrialBalance = async (req, res) => {
  const { from, to } = req.query;

  const entries = await JournalEntry.find({
    date: { $gte: new Date(from), $lte: new Date(to) },
    companyId: req.companyId,
  });

  const balance = {};

  entries.forEach((j) => {
    j.entries.forEach((e) => {
      if (!balance[e.account]) {
        balance[e.account] = { debit: 0, credit: 0 };
      }

      balance[e.account].debit += e.debit || 0;
      balance[e.account].credit += e.credit || 0;
    });
  });

  res.json(balance);
};

export const getBalanceSheet = async (req, res) => {
  const entries = await JournalEntry.find({
    companyId: req.companyId,
  });

  let assets = 0;
  let liabilities = 0;
  let equity = 0;

  entries.forEach((j) => {
    j.entries.forEach((e) => {
      if (e.account.includes("Asset")) assets += e.debit - e.credit;
      if (e.account.includes("Liability")) liabilities += e.credit - e.debit;
      if (e.account.includes("Equity")) equity += e.credit - e.debit;
    });
  });

  res.json({
    assets,
    liabilities,
    equity,
  });
};