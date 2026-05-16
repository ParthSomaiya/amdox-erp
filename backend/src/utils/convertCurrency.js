import Currency from "../models/Currency.js";

export const convert = async (amount, from, to) => {
  const fromRate = await Currency.findOne({ code: from });
  const toRate = await Currency.findOne({ code: to });

  if (!fromRate || !toRate) return amount;

  return (amount / fromRate.rate) * toRate.rate;
};