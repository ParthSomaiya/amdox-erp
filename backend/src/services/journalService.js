import {
  createLedgerEntry,
} from "./ledgerService.js";

export const createDoubleEntry =
  async ({
    debitAccount,
    creditAccount,
    amount,
    description,
    reference,
  }) => {

    // DEBIT ENTRY
    await createLedgerEntry({

      account:
        debitAccount,

      type: "DEBIT",

      amount,

      description,

      reference,

    });

    // CREDIT ENTRY
    await createLedgerEntry({

      account:
        creditAccount,

      type: "CREDIT",

      amount,

      description,

      reference,

    });

    return {
      success: true,
    };

  };