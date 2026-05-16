import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    API.get("/payroll").then((res) => setPayrolls(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-semibold mb-4">Payroll List</h2>

      <div className="bg-white shadow rounded">
        {payrolls.map((payroll) => (
          <div
            key={payroll._id}
            className="border-b p-4 flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <p>{payroll.employeeId?.name}</p>
              <p className="text-sm text-gray-500">
                Month: {payroll.month}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <button
                onClick={() =>
                  window.open(
                    `http://localhost:5000/api/payslip/${payroll._id}`,
                    "_blank"
                  )
                }
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Download Payslip
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}