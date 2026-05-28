import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  IndianRupee,
  User,
} from "lucide-react";

import API from "../services/api";

export default function GeneratePayroll() {

  const [employees, setEmployees] =
    useState([]);

  const [employeeId, setEmployeeId] =
    useState("");

  const [month, setMonth] =
    useState("");

  const [basicSalary, setBasicSalary] =
    useState("");

  const [bonus, setBonus] =
    useState("");

  const [deduction, setDeduction] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ================= FETCH =================

  useEffect(() => {

    fetchEmployees();

  }, []);

  const fetchEmployees =
    async () => {

      try {

        const res =
          await API.get("/employees");

        setEmployees(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  // ================= NET SALARY =================

  const netSalary =
    useMemo(() => {

      return (
        Number(basicSalary || 0) +
        Number(bonus || 0) -
        Number(deduction || 0)
      );

    }, [
      basicSalary,
      bonus,
      deduction,
    ]);

  // ================= SUBMIT =================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await API.post(
          "/payroll/generate",
          {
            employeeId,
            month,
            basicSalary,
            bonus,
            deduction,
          }
        );

        alert(
          "Payroll generated successfully"
        );

        setEmployeeId("");
        setMonth("");
        setBasicSalary("");
        setBonus("");
        setDeduction("");

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.message ||
          "Payroll generation failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-emerald-500
          via-green-500
          to-teal-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <h1 className="text-4xl font-black">
          Generate Payroll
        </h1>

        <p className="mt-2 text-green-100">
          Create payrolls and employee salary slips
        </p>

      </div>

      {/* FORM */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-xl
          p-8
          max-w-5xl
        "
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* TOP */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* EMPLOYEE */}

            <div>

              <label className="block font-semibold mb-2">
                Employee
              </label>

              <select
                value={employeeId}
                onChange={(e) =>
                  setEmployeeId(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  focus:border-green-500
                "
              >

                <option value="">
                  Select Employee
                </option>

                {

                  employees.map((emp) => (

                    <option
                      key={emp._id}
                      value={emp._id}
                    >

                      {
                        emp?.userId?.name ||
                        emp?.name
                      }

                    </option>

                  ))

                }

              </select>

            </div>

            {/* MONTH */}

            <div>

              <label className="block font-semibold mb-2">
                Month
              </label>

              <input
                type="month"
                value={month}
                onChange={(e) =>
                  setMonth(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  focus:border-green-500
                "
              />

            </div>

          </div>

          {/* SALARY */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            <InputBox
              label="Basic Salary"
              value={basicSalary}
              setValue={setBasicSalary}
            />

            <InputBox
              label="Bonus"
              value={bonus}
              setValue={setBonus}
            />

            <InputBox
              label="Deduction"
              value={deduction}
              setValue={setDeduction}
            />

          </div>

          {/* SUMMARY */}

          <div
            className="
              bg-slate-100
              rounded-3xl
              p-8
            "
          >

            <h2 className="text-2xl font-black mb-6">
              Payroll Summary
            </h2>

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-6
              "
            >

              <SummaryCard
                title="Salary"
                value={basicSalary}
              />

              <SummaryCard
                title="Bonus"
                value={bonus}
                green
              />

              <SummaryCard
                title="Deduction"
                value={deduction}
                red
              />

              <SummaryCard
                title="Net Salary"
                value={netSalary}
                blue
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-gradient-to-r
              from-green-600
              to-emerald-500
              text-white
              py-4
              rounded-2xl
              text-lg
              font-bold
              hover:scale-[1.01]
              transition-all
              disabled:opacity-50
            "
          >

            {
              loading
                ? "Generating Payroll..."
                : "Generate Payroll"
            }

          </button>

        </form>

      </div>

    </div>

  );

}

// ================= COMPONENTS =================

function InputBox({
  label,
  value,
  setValue,
}) {

  return (

    <div>

      <label className="block font-semibold mb-2">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        className="
          w-full
          border
          border-gray-300
          rounded-2xl
          px-5
          py-4
          outline-none
          focus:border-green-500
        "
      />

    </div>

  );

}

function SummaryCard({
  title,
  value,
  green,
  red,
  blue,
}) {

  return (

    <div>

      <p className="text-gray-500">
        {title}
      </p>

      <h3
        className={`
          text-3xl
          font-black
          mt-2
          ${green && "text-green-600"}
          ${red && "text-red-600"}
          ${blue && "text-blue-600"}
        `}
      >

        ₹{value || 0}

      </h3>

    </div>

  );

}