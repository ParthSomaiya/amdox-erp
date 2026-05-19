import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function ProjectBudget() {

  const [budgets, setBudgets] =
    useState([]);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets =
    async () => {

      const res =
        await axios.get(
          "http://localhost:5000/api/budgets",
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem(
                  "token"
                )}`,
            },
          }
        );

      setBudgets(res.data);
    };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        💰 Budget vs Actual
      </h1>

      <div className="space-y-4">

        {budgets.map((b) => (

          <div
            key={b._id}
            className="bg-white shadow rounded p-4"
          >

            <h2 className="font-bold">
              {b.projectId?.name}
            </h2>

            <p>
              Planned:
              ₹{b.plannedBudget}
            </p>

            <p>
              Actual:
              ₹{b.actualCost}
            </p>

            <p>
              Remaining:
              ₹{b.remaining}
            </p>

            <p>
              Burn Rate:
              {b.burnRate}%
            </p>

            <div className="bg-gray-200 h-4 rounded mt-3">

              <div
                className="bg-red-500 h-4 rounded"
                style={{
                  width:
                    `${b.burnRate}%`,
                }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}