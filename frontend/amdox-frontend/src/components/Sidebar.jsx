import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const token = localStorage.getItem("token");

  const location = useLocation();

  if (!token) return null;

  let role = null;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (err) {
    console.log(err);
  }

  const menus = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/dashboard",
      roles: ["ADMIN", "HR", "FINANCE", "EMPLOYEE"],
    },

    {
      label: "Employees",
      icon: "👥",
      path: "/employees",
      roles: ["ADMIN", "HR"],
    },

    {
      label: "Finance",
      icon: "💰",
      path: "/finance-analytics",
      roles: ["ADMIN", "FINANCE"],
    },

    {
      label: "Inventory",
      icon: "📦",
      path: "/inventory",
      roles: ["ADMIN", "FINANCE"],
    },

    {
      label: "Projects",
      icon: "🧩",
      path: "/projects",
      roles: ["ADMIN", "HR"],
    },

    {
      label: "Reports",
      icon: "📄",
      path: "/reports",
      roles: ["ADMIN"],
    },

    {
      label: "Analytics",
      icon: "📈",
      path: "/analytics",
      roles: ["ADMIN", "HR", "FINANCE"],
    },

    {
      label: "Calendar",
      icon: "📅",
      path: "/calendar",
      roles: ["ADMIN", "HR"],
    },

    {
      label: "Payroll",
      icon: "🧾",
      path: "/payroll",
      roles: ["ADMIN", "HR"],
    },

    {
      label: "Audit Logs",
      icon: "📜",
      path: "/admin/auditlogs",
      roles: ["ADMIN"],
    },

    {
      label: "Tenants",
      icon: "🏢",
      path: "/admin/tenantmanagement",
      roles: ["ADMIN"],
    },

    {
      label: "Security",
      icon: "🔐",
      path: "/admin/securitysettings",
      roles: ["ADMIN"],
    },

    {
      label: "Notifications",
      icon: "🔔",
      path: "/notifications",
      roles: ["ADMIN", "HR", "FINANCE"],
    },

    {
      label: "Settings",
      icon: "⚙️",
      path: "/admin/adminsettings",
      roles: ["ADMIN"],
    },
  ];

  return (
    <aside
      className="
        w-72
        min-h-screen
        bg-[#0B1120]
        border-r
        border-white/5
        flex
        flex-col
      "
    >
      {/* LOGO */}
      <div className="h-24 flex items-center px-8 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AMDOX ERP
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Enterprise Intelligence
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {menus
          .filter((item) =>
            item.roles.includes(role)
          )
          .map((item) => {

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  transition-all
                  duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span className="font-medium text-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}
      </div>
    </aside>
  );
}