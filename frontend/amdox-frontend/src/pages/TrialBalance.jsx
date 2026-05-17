import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function TrialBalance() {
  const [data, setData] = useState({});
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  const fetchData = async () => {
    const res = await API.get(`/reports/trial-balance?from=${from}&to=${to}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl font-bold mb-4">Trial Balance</h2>

      <div className="flex gap-4 mb-4">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button onClick={fetchData} className="bg-blue-600 text-white px-4 rounded">
          Apply
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Account</th>
            <th className="p-2">Debit</th>
            <th className="p-2">Credit</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((acc) => (
            <tr key={acc}>
              <td className="p-2">{acc}</td>
              <td className="p-2 text-green-600">{data[acc].debit}</td>
              <td className="p-2 text-red-500">{data[acc].credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}