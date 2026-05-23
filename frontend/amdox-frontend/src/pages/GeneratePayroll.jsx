import { useState } from "react";
import API from "../services/api";

export default function GeneratePayroll() {
  const [employeeId, setEmployeeId] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [month, setMonth] = useState("");

  const generate = async () => {
    await API.post("/payroll/generate", {
      employeeId,
      basicSalary,
      bonus,
      deductions,
      month,
    });

    alert("Payroll generated");
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-6">

      <h2 className="text-2xl font-bold mb-5">
        Generate Payroll
      </h2>

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Employee ID"
        onChange={(e) =>
          setEmployeeId(e.target.value)
        }
      />

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Basic Salary"
        onChange={(e) =>
          setBasicSalary(e.target.value)
        }
      />

      <button
        onClick={generate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate
      </button>

    </div>
  );
}