import { Line } from "react-chartjs-2";

export default function RevenueChart({ data }) {
  const chartData = {
    labels: data.map(d => `Month ${d._id}`),
    datasets: [
      {
        label: "Revenue",
        data: data.map(d => d.total),
      },
    ],
  };

  return <Line data={chartData} />;
}