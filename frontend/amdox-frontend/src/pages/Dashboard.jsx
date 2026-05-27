import {
  Users,
  IndianRupee,
  Briefcase,
  Calendar,
} from "lucide-react";


export default function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (

    <div className="space-y-6">

      {/* HERO */}

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

          Welcome {user?.name}

        </h1>

        <p className="mt-2 text-cyan-100">

          Role : {user?.role}

        </p>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Employees
          </p>

          <h2 className="text-4xl font-black mt-3">
            120
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Projects
          </p>

          <h2 className="text-4xl font-black mt-3">
            18
          </h2>

        </div>

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
            Revenue
          </p>

          <h2 className="text-4xl font-black mt-3">
            ₹8.4L
          </h2>

        </div>

      </div>

    </div>

  );

}