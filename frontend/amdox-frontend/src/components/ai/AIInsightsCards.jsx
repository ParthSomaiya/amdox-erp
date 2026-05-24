export default function AIInsightsCards({

  data,

  loading,

}) {

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="bg-white p-5 rounded shadow">

        <p className="text-lg font-semibold">

          Loading AI Insights...

        </p>

      </div>

    );

  }

  // ================= EMPTY =================

  if (!data) {

    return (

      <div className="bg-white p-5 rounded shadow">

        <p>No AI insights available.</p>

      </div>

    );

  }

  return (

    <div className="grid md:grid-cols-3 gap-4">

      {/* INSIGHTS */}

      <div className="bg-white p-5 rounded shadow border">

        <h2 className="font-bold text-lg mb-3">

          📊 AI Insights

        </h2>

        <p className="text-gray-700">

          {data.insights || "No insights"}

        </p>

      </div>

      {/* TRENDS */}

      <div className="bg-white p-5 rounded shadow border">

        <h2 className="font-bold text-lg mb-3">

          📈 Trends

        </h2>

        <p className="text-gray-700">

          {data.trends || "No trends"}

        </p>

      </div>

      {/* RECOMMENDATIONS */}

      <div className="bg-white p-5 rounded shadow border">

        <h2 className="font-bold text-lg mb-3">

          💡 Recommendations

        </h2>

        <p className="text-gray-700">

          {data.recommendations || "No recommendations"}

        </p>

      </div>

    </div>

  );

}