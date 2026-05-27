import MainLayout from "../layouts/MainLayout";

export default function EmployeeDashboard() {

  const user =
    JSON.parse(localStorage.getItem("user") || "{}");

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* ================= HERO ================= */}

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

            Employee Dashboard 👨‍💼

          </h1>

          <p className="mt-3 text-lg text-cyan-100">

            Welcome back, {user?.name}

          </p>

        </div>

        {/* ================= CARDS ================= */}

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
              95%
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

            <h2 className="text-2xl font-black mt-3 text-green-600">
              Paid
            </h2>

          </div>

        </div>

        {/* ================= PROFILE ================= */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow
            p-8
          "
        >

          <h2 className="text-2xl font-bold mb-5">

            Employee Information

          </h2>

          <div className="space-y-4">

            <div>

              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <h3 className="text-xl font-semibold">
                {user?.name || "N/A"}
              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <h3 className="text-xl font-semibold">
                {user?.email || "N/A"}
              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Role
              </p>

              <h3 className="text-xl font-semibold">
                {user?.role || "EMPLOYEE"}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}