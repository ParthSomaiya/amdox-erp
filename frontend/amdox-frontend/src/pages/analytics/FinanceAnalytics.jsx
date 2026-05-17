import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

export default function FinanceAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/analytics/finance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data));
  }, []);

  const chartData = {
    labels: data.map((d) => `Month ${d._id}`),
    datasets: [
      {
        label: "Revenue",
        data: data.map((d) => d.revenue),
      },
    ],
  };

  return (
    <div className="p-6">
      <h2>📈 Finance Analytics</h2>
      <Bar data={chartData} />
    </div>
  );
}