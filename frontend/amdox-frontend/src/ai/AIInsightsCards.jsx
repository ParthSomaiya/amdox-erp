export default function AIInsightsCards({ data, loading }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">

      {/* LOADING STATE */}
      {loading && (
        <div className="col-span-3 p-4 bg-gray-100 rounded">
          Loading AI insights...
        </div>
      )}

      {/* INSIGHT 1 */}
      {data?.insights && (
        <div className="p-4 bg-white shadow rounded border">
          <h3 className="font-bold text-lg mb-2">📊 AI Insights</h3>
          <p className="text-gray-700">{data.insights}</p>
        </div>
      )}

      {/* TREND CARD */}
      {data?.trends && (
        <div className="p-4 bg-white shadow rounded border">
          <h3 className="font-bold text-lg mb-2">📈 Trends</h3>
          <p className="text-gray-700">{data.trends}</p>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {data?.recommendations && (
        <div className="p-4 bg-white shadow rounded border">
          <h3 className="font-bold text-lg mb-2">💡 Recommendations</h3>
          <p className="text-gray-700">{data.recommendations}</p>
        </div>
      )}

    </div>
  );
}