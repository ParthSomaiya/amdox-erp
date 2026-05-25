import { useEffect, useState } from "react";

import API from "../services/api";

import MainLayout from "../layouts/MainLayout";

import CardSkeleton from "../components/CardSkeleton";

import KpiCard from "../components/dashboard/KpiCard";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export default function Dashboard() {

  const [data, setData] = useState({
    stats: {},
    monthly: [],
  });

  const [analytics, setAnalytics] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    API.get("/dashboard")
      .then((res) => {

        setData(res.data);

        setLoading(false);

      })
      .catch(() => setLoading(false));

    API.get("/hr/analytics")
      .then((res) =>
        setAnalytics(res.data)
      );

  }, []);

  return (

    <MainLayout>

      <div className="space-y-8">

        {/* HERO */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            border
            border-white/5
            bg-gradient-to-br
            from-cyan-500/10
            via-blue-500/5
            to-indigo-500/10
            p-10
          "
        >

          {/* GLOW */}

          <div
            className="
              absolute
              top-[-100px]
              right-[-100px]
              w-[300px]
              h-[300px]
              rounded-full
              bg-cyan-500/10
              blur-[120px]
            "
          />

          <div className="relative z-10">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-cyan-500/10
                border
                border-cyan-500/20
                text-cyan-300
                text-sm
                mb-8
              "
            >
              ✨ Enterprise Intelligence
            </div>

            <h1
              className="
                text-5xl
                lg:text-6xl
                font-black
                tracking-tight
                leading-tight
              "
            >
              Welcome Back,
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                Executive Team
              </span>

            </h1>

            <p
              className="
                text-slate-400
                text-lg
                mt-6
                max-w-3xl
              "
            >
              Monitor real-time business operations,
              financial intelligence, workforce analytics
              and enterprise performance from one unified dashboard.
            </p>

          </div>

        </div>

        {/* KPI */}

        {loading ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <KpiCard
              title="Employees"
              value={
                data?.stats?.employees || 0
              }
              growth="+12%"
              icon="👥"
            />

            <KpiCard
              title="Leaves"
              value={
                data?.stats?.leaves || 0
              }
              growth="+4%"
              icon="📅"
            />

            <KpiCard
              title="Payroll"
              value={
                data?.stats?.payroll || 0
              }
              growth="+18%"
              icon="💰"
            />

            <KpiCard
              title="Total Staff"
              value={
                analytics.totalEmployees || 0
              }
              growth="+8%"
              icon="📊"
            />

          </div>

        )}

        {/* CHART GRID */}

        <div className="grid xl:grid-cols-3 gap-8">

          {/* MAIN CHART */}

          <div
            className="
              xl:col-span-2
              rounded-[36px]
              border
              border-white/5
              bg-[#0F172A]
              p-8
            "
          >

            <div className="flex items-center justify-between mb-10">

              <div>

                <h2 className="text-3xl font-bold">
                  Enterprise Growth
                </h2>

                <p className="text-slate-400 mt-2">
                  Monthly workforce & revenue intelligence
                </p>

              </div>

              <div
                className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-cyan-500/10
                  text-cyan-300
                  text-sm
                "
              >
                Live Analytics
              </div>

            </div>

            <ResponsiveContainer
              width="100%"
              height={420}
            >

              <LineChart data={data.monthly}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1E293B"
                />

                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                />

                <YAxis stroke="#94A3B8" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#06B6D4"
                  strokeWidth={4}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* AI PANEL */}

          <div
            className="
              rounded-[36px]
              border
              border-white/5
              bg-[#0F172A]
              p-8
            "
          >

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                AI Insights
              </h2>

              <div
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-500
                  flex
                  items-center
                  justify-center
                "
              >
                🤖
              </div>

            </div>

            <div className="space-y-5 mt-10">

              <div
                className="
                  rounded-3xl
                  bg-[#020617]
                  border
                  border-white/5
                  p-5
                "
              >

                <p className="text-sm text-slate-400">
                  Revenue Forecast
                </p>

                <h3 className="text-3xl font-bold mt-3">
                  +18%
                </h3>

                <p className="text-emerald-400 mt-3 text-sm">
                  Predicted growth next quarter
                </p>

              </div>

              <div
                className="
                  rounded-3xl
                  bg-[#020617]
                  border
                  border-white/5
                  p-5
                "
              >

                <p className="text-sm text-slate-400">
                  Workforce Efficiency
                </p>

                <h3 className="text-3xl font-bold mt-3">
                  94%
                </h3>

                <p className="text-cyan-400 mt-3 text-sm">
                  AI optimized operations
                </p>

              </div>

              <div
                className="
                  rounded-3xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-500
                  p-6
                "
              >

                <p className="text-sm opacity-80">
                  Smart Recommendation
                </p>

                <h3 className="text-2xl font-bold mt-4 leading-relaxed">
                  Automate payroll approvals
                  to reduce HR workload by 36%.
                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* ANALYTICS */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* PERFORMANCE */}

          <div
            className="
              lg:col-span-2
              rounded-[36px]
              border
              border-white/5
              bg-[#0F172A]
              p-8
            "
          >

            <div className="mb-10">

              <h2 className="text-3xl font-bold">
                Performance Overview
              </h2>

              <p className="text-slate-400 mt-2">
                Business productivity analytics
              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <AreaChart data={data.monthly}>

                <defs>

                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#06B6D4"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="95%"
                      stopColor="#06B6D4"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1E293B"
                />

                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                />

                <YAxis stroke="#94A3B8" />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06B6D4"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

          {/* ACTIVITY */}

          <div
            className="
              rounded-[36px]
              border
              border-white/5
              bg-[#0F172A]
              p-8
            "
          >

            <h2 className="text-3xl font-bold">
              Activity Feed
            </h2>

            <div className="space-y-6 mt-10">

              {[
                "Payroll generated successfully",
                "New employee onboarding completed",
                "Inventory updated for warehouse",
                "Finance report generated",
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >

                  <div
                    className="
                      h-3
                      w-3
                      rounded-full
                      bg-cyan-400
                      mt-2
                    "
                  />

                  <div>

                    <p className="font-medium">
                      {item}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Just now
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}