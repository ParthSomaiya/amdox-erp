import { useEffect, useState } from "react";
import API from "../services/api";

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
              <a
                href={`http://localhost:5000/api/payroll/payslip/${payroll._id}`}
                target="_blank"
              >
                Download Payslip
              </a>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}