import Ledger from "../models/Ledger.js";

export const createLedgerEntry =
  async ({
    account,
    type,
    amount,
    description,
    reference,
  }) => {

    return await Ledger.create({

      account,

      type,

      amount,

      description,

      reference,

      date: new Date(),

    });

  };