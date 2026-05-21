import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="text-2xl font-bold text-blue-600">
          AMDOX ERP
        </div>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-8 font-medium">

          <Link
            to="/"
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="hover:text-blue-600 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="hover:text-blue-600 transition"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}