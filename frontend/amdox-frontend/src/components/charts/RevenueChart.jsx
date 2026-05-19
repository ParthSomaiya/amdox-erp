import { Line } from "react-chartjs-2";

export default function RevenueChart({ data }) {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: "Revenue",
        data: data.map(d => d.revenue),
      },
    ],
  };

  return <Line data={chartData} />;
}