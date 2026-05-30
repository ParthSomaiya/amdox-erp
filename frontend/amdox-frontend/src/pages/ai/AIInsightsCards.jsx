import { TrendingUp, Sparkles, Lightbulb, ShieldCheck } from "lucide-react";

export default function AIInsightsCards({ data, loading }) {
  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-50 border rounded-3xl animate-pulse space-y-3">
        <Sparkles className="animate-spin text-indigo-600 mx-auto" size={28} />
        <h3 className="font-bold text-slate-700 text-sm">Gemini AI compiling intelligence...</h3>
      </div>
    );
  }

  // ડિફોલ્ટ ઇન્ટેલિજન્સ ડેટા
  const insights = data?.insights || "EBITDA profit margins are stable at 18.4%. Payroll cycles are fully optimized with no manual transaction delays detected this quarter.";
  const trends = data?.trends || "Inventory demand modeling predicts a 15% increase in orders for premium warehouse SKUs over the next 30 days. Recommend safety stock replenishment.";
  const recommendations = data?.recommendations || "Automate accounts receivable triggers for outstanding invoices over ₹50,000 to maximize cashflow velocities.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* AI Insights */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-xl" />
        <div className="flex items-center justify-between pb-3 border-b">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={16} /> AI Insights
          </h3>
          <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">Financial</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{insights}</p>
      </div>

      {/* Trends */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-sky-500/5 rounded-full blur-xl" />
        <div className="flex items-center justify-between pb-3 border-b">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <TrendingUp className="text-sky-600" size={16} /> Market Trends
          </h3>
          <span className="text-[10px] font-black bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full">SCM</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{trends}</p>
      </div>

      {/* Recommendations */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl" />
        <div className="flex items-center justify-between pb-3 border-b">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <Lightbulb className="text-emerald-600" size={16} /> Strategic Action
          </h3>
          <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">Operational</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{recommendations}</p>
      </div>

    </div>
  );
}