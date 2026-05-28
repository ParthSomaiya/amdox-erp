import {
  useEffect,
  useState,
} from "react";

import {
  Download,
  IndianRupee,
  Calendar,
  User,
} from "lucide-react";

import API from "../services/api";

export default function Payroll() {

  const [payrolls, setPayrolls] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ================= FETCH =================

  useEffect(() => {

    fetchPayrolls();

  }, []);

  const fetchPayrolls =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get("/payroll");

        setPayrolls(res.data);

      } catch (err) {

        console.log(err);

        setError(
          "Failed to load payroll records"
        );

      } finally {

        setLoading(false);

      }

    };

  // ================= FORMAT =================

  const formatCurrency =
    (amount) => {

      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(amount || 0);

    };

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-indigo-600
          via-blue-600
          to-cyan-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <h1 className="text-4xl font-black">
          Payroll Management
        </h1>

        <p className="mt-2 text-cyan-100">
          View and manage employee payroll records
        </p>

      </div>

      {/* CONTENT */}

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

          <div className="col-span-4">
            Employee
          </div>

          <div className="col-span-3">
            Month
          </div>

          <div className="col-span-3">
            Net Salary
          </div>

          <div className="col-span-2">
            Action
          </div>

        </div>

        {/* BODY */}

        {

          loading ? (

            <div className="p-20 text-center">

              <h2 className="text-2xl font-bold">
                Loading Payrolls...
              </h2>

            </div>

          ) : error ? (

            <div className="p-20 text-center">

              <h2 className="text-red-500 text-2xl font-bold">
                {error}
              </h2>

            </div>

          ) : payrolls.length === 0 ? (

            <div className="p-20 text-center">

              <h2 className="text-3xl font-black">
                No Payroll Records Found
              </h2>

            </div>

          ) : (

            payrolls.map((payroll) => (

              <div
                key={payroll._id}
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

                <div className="col-span-4">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        h-12
                        w-12
                        rounded-2xl
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <User className="text-blue-600" />

                    </div>

                    <div>

                      <h2 className="font-bold text-lg">
                        {
                          payroll?.employeeId?.name ||
                          "Employee"
                        }
                      </h2>

                    </div>

                  </div>

                </div>

                {/* MONTH */}

                <div
                  className="
                    col-span-3
                    flex
                    items-center
                    gap-2
                    text-gray-700
                    font-medium
                  "
                >

                  <Calendar size={18} />

                  {payroll.month}

                </div>

                {/* SALARY */}

                <div
                  className="
                    col-span-3
                    flex
                    items-center
                    gap-2
                    font-black
                    text-green-600
                  "
                >

                  <IndianRupee size={18} />

                  {
                    formatCurrency(
                      payroll.netSalary
                    )
                  }

                </div>

                {/* ACTION */}

                <div className="col-span-2">

                  <a
                    href={`http://localhost:5000/api/payroll/payslip/${payroll._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      bg-gradient-to-r
                      from-blue-600
                      to-cyan-500
                      text-white
                      px-5
                      py-3
                      rounded-2xl
                      font-semibold
                      hover:scale-105
                      transition-all
                    "
                  >

                    <Download size={18} />

                    Payslip

                  </a>

                </div>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}