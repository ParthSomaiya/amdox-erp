import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Sparkles } from "lucide-react";
import API from "../../services/api";

export default function InventoryForecast() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/inventory/reorder-ai")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const mapped = list.map((p, index) => ({
          week: p.product || `W${index + 1}`,
          "Current Stock": p.currentStock || 0,
          "Suggested Stock": p.suggestedOrder || 15
        }));
        setData(mapped);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Sparkles size={20} className="text-indigo-600" /> AI Stock Reorder Projections
      </h2>
      {data.length === 0 ? (
        <p className="text-slate-500 text-sm">No products available for forecasting analysis.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="Current Stock" stroke="#4f46e5" strokeWidth={2} />
            <Line type="monotone" dataKey="Suggested Stock" stroke="#e11d48" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}