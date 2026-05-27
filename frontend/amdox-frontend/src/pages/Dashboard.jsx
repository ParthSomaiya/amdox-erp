import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {

  const user =
    JSON.parse(localStorage.getItem("user") || "{}");

  const role =
    user?.role || "USER";

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* ================= HEADER ================= */}

        <div
          className="
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            rounded-3xl
            p-8
            text-white
            shadow-xl
          "
        >

          <h1 className="text-4xl font-black">

            Welcome {user?.name || "User"} 👋

          </h1>

          <p className="mt-3 text-lg text-cyan-100">

            Role : {role}

          </p>

        </div>

        {/* ================= STATS ================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >

          <div className="bg-white rounded-2xl p-6 shadow">

            <p className="text-gray-500">
              Employees
            </p>

            <h2 className="text-4xl font-black mt-3">
              124
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow">

            <p className="text-gray-500">
              Projects
            </p>

            <h2 className="text-4xl font-black mt-3">
              18
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow">

            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-4xl font-black mt-3">
              ₹8.2L
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow">

            <p className="text-gray-500">
              Attendance
            </p>

            <h2 className="text-4xl font-black mt-3">
              92%
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

          <h2 className="text-2xl font-bold mb-6">

            User Information

          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <p className="text-gray-500 text-sm">
                Full Name
              </p>

              <h3 className="text-xl font-semibold mt-1">
                {user?.name || "N/A"}
              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Email Address
              </p>

              <h3 className="text-xl font-semibold mt-1">
                {user?.email || "N/A"}
              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                User Role
              </p>

              <h3 className="text-xl font-semibold mt-1">
                {role}
              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Company
              </p>

              <h3 className="text-xl font-semibold mt-1">
                AMDOX ERP
              </h3>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}