export default function EmployeeDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (

    <div className="space-y-6">

      <div
        className="
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <h1 className="text-4xl font-black">

          Employee Dashboard

        </h1>

        <p className="mt-2 text-cyan-100">

          Welcome {user?.name}

        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Attendance
          </p>

          <h2 className="text-4xl font-black mt-3">
            96%
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Leaves Left
          </p>

          <h2 className="text-4xl font-black mt-3">
            8
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Salary Status
          </p>

          <h2 className="text-2xl font-black text-green-600 mt-3">

            Paid

          </h2>

        </div>

      </div>

    </div>

  );

}