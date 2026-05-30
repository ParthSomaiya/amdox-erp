import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../../services/api";

import {
  TrendingUp,
  Users,
  Wallet,
  CalendarDays,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

export default function Analytics() {

  // =========================
  // STATE
  // =========================

  const [analytics, setAnalytics] =
    useState({

      employees: [],

      payroll: [],

      leaves: [],

    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  // =========================
  // FETCH ANALYTICS
  // =========================

  useEffect(() => {

    fetchAnalytics();

  }, [selectedMonth]);

  const fetchAnalytics =
    async () => {

      try {

        setLoading(true);

        setError("");

        const query =
          selectedMonth
            ? `?month=${selectedMonth}`
            : "";

        const res =
          await API.get(
            `/analytics${query}`
          );

        setAnalytics({

          employees:
            res.data?.employees || [],

          payroll:
            res.data?.payroll || [],

          leaves:
            res.data?.leaves || [],

        });

      } catch (err) {

        console.log(err);

        setError(
          err?.response?.data?.message ||
          "Failed to load analytics"
        );

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // SUMMARY CARDS
  // =========================

  const totalEmployees =
    useMemo(() => {

      return analytics.employees.reduce(

        (acc, item) =>

          acc + (item.count || 0),

        0

      );

    }, [analytics.employees]);

  const totalPayroll =
    useMemo(() => {

      return analytics.payroll.reduce(

        (acc, item) =>

          acc + (item.total || 0),

        0

      );

    }, [analytics.payroll]);

  const totalLeaves =
    useMemo(() => {

      return analytics.leaves.reduce(

        (acc, item) =>

          acc + (item.count || 0),

        0

      );

    }, [analytics.leaves]);

  // =========================
  // CUSTOM TOOLTIP
  // =========================

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (
      active &&
      payload &&
      payload.length
    ) {

      return (

        <div
          className="
            bg-slate-900
            text-white
            px-4
            py-3
            rounded-2xl
            shadow-xl
            border
            border-white/10
          "
        >

          <p className="font-semibold">
            {label}
          </p>

          <p className="text-cyan-300 mt-1">
            Value: {payload[0].value}
          </p>

        </div>

      );

    }

    return null;

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-50
        "
      >

        <div className="text-center">

          <div
            className="
              h-16
              w-16
              border-4
              border-cyan-500
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <h2
            className="
              mt-6
              text-2xl
              font-black
              text-slate-800
            "
          >

            Loading Analytics...

          </h2>

        </div>

      </div>

    );

  }

  return (

    <div className="space-y-8">

      {/* ================= HERO ================= */}

      <div
        className="
          bg-gradient-to-r
          from-cyan-600
          via-blue-600
          to-indigo-700
          rounded-[32px]
          p-10
          text-white
          shadow-2xl
          relative
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-white/10
            rounded-full
            blur-3xl
          "
        />

        <div className="relative z-10">

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
            "
          >

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                  tracking-tight
                "
              >

                Business Analytics

              </h1>

              <p
                className="
                  mt-4
                  text-cyan-100
                  text-lg
                  max-w-2xl
                "
              >

                Real-time analytics for employees,
                payroll, leave distribution and
                organizational growth insights.

              </p>

            </div>

            {/* FILTER */}

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-5
                min-w-[280px]
              "
            >

              <label
                className="
                  text-sm
                  text-cyan-100
                  block
                  mb-3
                "
              >

                Filter by Month

              </label>

              <div className="flex gap-3">

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(
                      e.target.value
                    )
                  }
                  className="
                    flex-1
                    h-12
                    rounded-2xl
                    bg-white/10
                    border
                    border-white/20
                    px-4
                    text-white
                    outline-none
                  "
                />

                <button
                  onClick={fetchAnalytics}
                  className="
                    h-12
                    w-12
                    rounded-2xl
                    bg-white/10
                    border
                    border-white/20
                    flex
                    items-center
                    justify-center
                    hover:bg-white/20
                    transition-all
                  "
                >

                  <RefreshCcw size={18} />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ERROR ================= */}

      {

        error && (

          <div
            className="
              bg-red-50
              border
              border-red-200
              rounded-3xl
              p-5
              flex
              items-center
              gap-4
              text-red-600
            "
          >

            <AlertCircle size={24} />

            <p className="font-semibold">
              {error}
            </p>

          </div>

        )

      }

      {/* ================= STATS ================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {/* EMPLOYEES */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-8
            shadow-lg
            border
            border-slate-100
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-slate-500">
                Employees
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-3
                "
              >

                {totalEmployees}

              </h2>

            </div>

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-cyan-100
                flex
                items-center
                justify-center
                text-cyan-600
              "
            >

              <Users size={30} />

            </div>

          </div>

        </div>

        {/* PAYROLL */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-8
            shadow-lg
            border
            border-slate-100
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-slate-500">
                Payroll
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-3
                "
              >

                ₹{totalPayroll}

              </h2>

            </div>

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-emerald-100
                flex
                items-center
                justify-center
                text-emerald-600
              "
            >

              <Wallet size={30} />

            </div>

          </div>

        </div>

        {/* LEAVES */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-8
            shadow-lg
            border
            border-slate-100
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-slate-500">
                Leave Requests
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-3
                "
              >

                {totalLeaves}

              </h2>

            </div>

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-orange-100
                flex
                items-center
                justify-center
                text-orange-600
              "
            >

              <CalendarDays size={30} />

            </div>

          </div>

        </div>

        {/* GROWTH */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-8
            shadow-lg
            border
            border-slate-100
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-slate-500">
                Growth
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-3
                "
              >

                +24%

              </h2>

            </div>

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-indigo-100
                flex
                items-center
                justify-center
                text-indigo-600
              "
            >

              <TrendingUp size={30} />

            </div>

          </div>

        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
        "
      >

        {/* EMPLOYEE GROWTH */}

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-xl
            p-8
          "
        >

          <div className="mb-8">

            <h2
              className="
                text-2xl
                font-black
              "
            >

              Employee Growth

            </h2>

            <p className="text-slate-500 mt-2">
              Monthly employee expansion
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart
              data={analytics.employees}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />

              <XAxis dataKey="_id" />

              <YAxis />

              <Tooltip
                content={<CustomTooltip />}
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#06B6D4"
                strokeWidth={4}
                dot={{
                  r: 5,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* PAYROLL */}

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-xl
            p-8
          "
        >

          <div className="mb-8">

            <h2
              className="
                text-2xl
                font-black
              "
            >

              Payroll Trend

            </h2>

            <p className="text-slate-500 mt-2">
              Monthly payroll analytics
            </p>

          </div>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={analytics.payroll}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
              />

              <XAxis dataKey="_id" />

              <YAxis />

              <Tooltip
                content={<CustomTooltip />}
              />

              <Bar
                dataKey="total"
                radius={[10, 10, 0, 0]}
                fill="#3B82F6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= PIE CHART ================= */}

      <div
        className="
          bg-white
          rounded-[32px]
          shadow-xl
          p-8
        "
      >

        <div className="mb-8">

          <h2
            className="
              text-2xl
              font-black
            "
          >

            Leave Distribution

          </h2>

          <p className="text-slate-500 mt-2">
            Employee leave analytics overview
          </p>

        </div>

        <ResponsiveContainer
          width="100%"
          height={420}
        >

          <PieChart>

            <Pie
              data={analytics.leaves}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={70}
              paddingAngle={5}
              label
            >

              {

                analytics.leaves.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )

              }

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}