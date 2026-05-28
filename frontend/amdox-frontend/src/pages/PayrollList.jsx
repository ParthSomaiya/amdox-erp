import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../services/api";

export default function PayrollList() {

  const [payrolls, setPayrolls] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ================= FETCH PAYROLLS =================

  useEffect(() => {

    fetchPayrolls();

  }, []);

  const fetchPayrolls =
    async () => {

      try {

        const res =
          await API.get(
            "/payroll"
          );

        setPayrolls(
          res.data
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= FILTER =================

  const filteredPayrolls =
    useMemo(() => {

      return payrolls.filter((item) =>

        item?.employeeId?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    }, [payrolls, search]);

  // ================= STATUS STYLE =================

  const statusStyle =
    (status) => {

      switch (status) {

        case "PAID":

          return `
            bg-green-100
            text-green-700
          `;

        case "PENDING":

          return `
            bg-yellow-100
            text-yellow-700
          `;

        default:

          return `
            bg-gray-100
            text-gray-700
          `;

      }

    };

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-violet-600
          via-purple-600
          to-fuchsia-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <h1 className="text-4xl font-black">

          Payroll Management

        </h1>

        <p className="mt-2 text-purple-100">

          Manage all employee payroll records

        </p>

      </div>

      {/* SEARCH */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          p-5
        "
      >

        <input
          type="text"
          placeholder="Search employee payroll..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-5
            py-4
            outline-none
            focus:border-purple-500
          "
        />

      </div>

      {/* PAYROLL TABLE */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-xl
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-12
            bg-slate-100
            px-8
            py-5
            text-sm
            font-bold
            uppercase
            text-gray-600
          "
        >

          <div className="col-span-3">
            Employee
          </div>

          <div className="col-span-2">
            Salary
          </div>

          <div className="col-span-2">
            Bonus
          </div>

          <div className="col-span-2">
            Deduction
          </div>

          <div className="col-span-2">
            Net Salary
          </div>

          <div className="col-span-1">
            Status
          </div>

        </div>

        {/* BODY */}

        {

          loading ? (

            <div className="p-20 text-center">

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >

                Loading Payrolls...

              </h2>

            </div>

          ) : filteredPayrolls.length === 0 ? (

            <div className="p-20 text-center">

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                No Payroll Records Found

              </h2>

            </div>

          ) : (

            filteredPayrolls.map((item) => (

              <div

                key={item._id}

                className="
                  grid
                  grid-cols-12
                  px-8
                  py-5
                  border-b
                  hover:bg-slate-50
                  transition-all
                "
              >

                {/* EMPLOYEE */}

                <div className="col-span-3">

                  <h2 className="font-bold">

                    {

                      item?.employeeId?.name ||

                      "Employee"

                    }

                  </h2>

                </div>

                {/* BASIC */}

                <div
                  className="
                    col-span-2
                    font-semibold
                  "
                >

                  ₹{

                    item.basicSalary ||

                    0

                  }

                </div>

                {/* BONUS */}

                <div
                  className="
                    col-span-2
                    text-green-600
                    font-bold
                  "
                >

                  ₹{

                    item.bonus ||

                    0

                  }

                </div>

                {/* DEDUCTION */}

                <div
                  className="
                    col-span-2
                    text-red-600
                    font-bold
                  "
                >

                  ₹{

                    item.deduction ||

                    0

                  }

                </div>

                {/* NET */}

                <div
                  className="
                    col-span-2
                    text-blue-600
                    font-black
                  "
                >

                  ₹{

                    item.netSalary ||

                    0

                  }

                </div>

                {/* STATUS */}

                <div className="col-span-1">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      ${statusStyle(
                        item.status
                      )}
                    `}
                  >

                    {

                      item.status ||

                      "PENDING"

                    }

                  </span>

                </div>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}