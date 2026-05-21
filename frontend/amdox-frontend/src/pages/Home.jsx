import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">

              Next Generation
              <span className="text-blue-600">
                {" "}ERP Platform
              </span>

            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">

              Manage HR, Finance, Inventory,
              Payroll, Analytics, Projects,
              Chat, Calendar and more —
              all in one powerful cloud ERP system.

            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex gap-4">

              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
              >
                Register
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop"
              alt="ERP"
              className="rounded-3xl shadow-2xl"
            />

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-16">

            Powerful ERP Modules

          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* HR */}
            <div className="bg-gray-50 p-8 rounded-3xl shadow hover:shadow-xl transition">

              <div className="text-5xl mb-4">👥</div>

              <h3 className="text-2xl font-bold mb-3">
                HR Management
              </h3>

              <p className="text-gray-600">
                Employee management, payroll,
                attendance, leave system and analytics.
              </p>

            </div>

            {/* FINANCE */}
            <div className="bg-gray-50 p-8 rounded-3xl shadow hover:shadow-xl transition">

              <div className="text-5xl mb-4">💰</div>

              <h3 className="text-2xl font-bold mb-3">
                Finance
              </h3>

              <p className="text-gray-600">
                Invoices, GST, reports,
                balance sheet and accounting tools.
              </p>

            </div>

            {/* INVENTORY */}
            <div className="bg-gray-50 p-8 rounded-3xl shadow hover:shadow-xl transition">

              <div className="text-5xl mb-4">📦</div>

              <h3 className="text-2xl font-bold mb-3">
                Inventory
              </h3>

              <p className="text-gray-600">
                Product tracking, stock history,
                purchase orders and analytics.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 text-center">

        <p>
          © 2026 AMDOX ERP — Enterprise Platform
        </p>

      </footer>

    </div>

  );

}