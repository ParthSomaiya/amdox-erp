import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    API.get("/payroll").then((res) => setPayrolls(res.data));
  }, []);

  // ✅ Upload function
  const handleUpload = async (payrollId) => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("payrollId", payrollId);

    await API.post("/payroll/upload-payslip", formData);

    alert("Payslip uploaded ✅");
  };

  return (
    <MainLayout>
      <h2 className="text-xl font-semibold mb-4">Payroll List</h2>

      <div className="bg-white shadow rounded">
        {payrolls.map((payroll) => (
          <div
            key={payroll._id}
            className="border-b p-4 flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <p>{payroll.employeeId?.name}</p>
              <p className="text-sm text-gray-500">
                Month: {payroll.month}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-2 items-center">

              {/* 📁 Upload */}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm"
              />

              <button
                onClick={() => handleUpload(payroll._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Upload
              </button>

              {/* 📥 Download */}
              <a
                href={`http://localhost:5000/api/payroll/payslip/${id}`}
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