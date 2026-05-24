import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function Reconciliation() {

  const [transactions,
    setTransactions] =
    useState([]);

  useEffect(() => {

    fetchTransactions();

  }, []);

  const fetchTransactions =
    async () => {

      try {

        const res =
          await API.get(
            "/finance/transactions"
          );

        setTransactions(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Bank Reconciliation

      </h1>

      <div className="bg-white shadow rounded">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3">
                Date
              </th>

              <th className="p-3">
                Description
              </th>

              <th className="p-3">
                Amount
              </th>

              <th className="p-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {transactions.map(
              (t) => (

                <tr
                  key={t._id}
                  className="border-b"
                >

                  <td className="p-3">

                    {new Date(
                      t.date
                    ).toLocaleDateString()}

                  </td>

                  <td className="p-3">

                    {t.description}

                  </td>

                  <td className="p-3">

                    ₹{t.amount}

                  </td>

                  <td className="p-3">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded">

                      Matched

                    </span>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}