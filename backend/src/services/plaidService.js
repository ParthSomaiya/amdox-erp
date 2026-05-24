import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
} from "plaid";

const config =
  new Configuration({

    basePath:
      PlaidEnvironments.sandbox,

    baseOptions: {

      headers: {

        "PLAID-CLIENT-ID":
          process.env.PLAID_CLIENT_ID,

        "PLAID-SECRET":
          process.env.PLAID_SECRET,

      },

    },

  });

const client =
  new PlaidApi(config);

export const getBankTransactions =
  async (accessToken) => {

    try {

      const response =
        await client.transactionsGet({

          access_token:
            accessToken,

          start_date:
            "2025-01-01",

          end_date:
            "2026-12-31",

        });

      return response.data.transactions;

    } catch (err) {

      console.log(err);

      return [];

    }

  };