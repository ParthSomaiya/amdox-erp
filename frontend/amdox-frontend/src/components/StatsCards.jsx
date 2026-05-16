export default function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-5 rounded shadow">
        <h3>Total Employees</h3>
        <p className="text-2xl font-bold">50</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Revenue</h3>
        <p className="text-2xl font-bold">₹10L</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Leaves Pending</h3>
        <p className="text-2xl font-bold">8</p>
      </div>
    </div>
  );
}