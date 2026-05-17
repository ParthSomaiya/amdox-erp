import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function BalanceSheet() {
  const [data, setData] = useState({});

  const fetchData = async () => {
    const res = await API.get("/reports/balance-sheet");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-6">Balance Sheet</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500">Assets</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{data.assets || 0}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500">Liabilities</h3>
          <p className="text-2xl font-bold text-red-500">
            ₹{data.liabilities || 0}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500">Equity</h3>
          <p className="text-2xl font-bold text-blue-600">
            ₹{data.equity || 0}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}