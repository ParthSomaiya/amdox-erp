import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  Briefcase,
  IndianRupee,
  TrendingUp,
  Wallet,
  AlertTriangle,
  RefreshCw,
  FolderKanban,
} from "lucide-react";

import API from "../services/api";

export default function ProjectsDashboard() {

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ================= FETCH PROJECTS =================

  useEffect(() => {

    fetchProjects();

  }, []);

  const fetchProjects =
    async () => {

      try {

        setLoading(true);

        setError("");

        const res =
          await API.get(
            "/projects"
          );

        setProjects(
          res.data || []
        );

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          "Failed to load projects"
        );

      } finally {

        setLoading(false);

      }

    };

  // ================= STATS =================

  const stats =
    useMemo(() => {

      const totalBudget =
        projects.reduce(
          (acc, item) =>
            acc +
            Number(
              item?.budget || 0
            ),
          0
        );

      const totalSpent =
        projects.reduce(
          (acc, item) =>
            acc +
            Number(
              item?.spent || 0
            ),
          0
        );

      const totalRemaining =
        totalBudget - totalSpent;

      const overBudget =
        projects.filter(
          (item) =>
            Number(
              item?.spent || 0
            ) >
            Number(
              item?.budget || 0
            )
        ).length;

      return {

        totalProjects:
          projects.length,

        totalBudget,

        totalSpent,

        totalRemaining,

        overBudget,

      };

    }, [projects]);

  // ================= FORMAT CURRENCY =================

  const formatCurrency =
    (amount) => {

      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(amount || 0);

    };

  // ================= PERCENTAGE =================

  const getProgress =
    (spent, budget) => {

      if (!budget) return 0;

      return Math.min(
        (
          (spent / budget) *
          100
        ).toFixed(0),
        100
      );

    };

  // ================= STATUS =================

  const getStatus =
    (spent, budget) => {

      if (
        spent > budget
      ) {

        return {
          label:
            "Over Budget",
          color:
            "bg-red-100 text-red-700",
        };

      }

      const progress =
        (
          spent /
          budget
        ) *
        100;

      if (
        progress >= 80
      ) {

        return {
          label:
            "Critical",
          color:
            "bg-yellow-100 text-yellow-700",
        };

      }

      return {
        label:
          "Healthy",
        color:
          "bg-green-100 text-green-700",
      };

    };

  return (

    <div className="space-y-8">

      {/* HERO SECTION */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-indigo-600
          via-blue-600
          to-cyan-500
          p-8
          text-white
          shadow-2xl
        "
      >

        <div
          className="
            absolute
            top-0
            right-0
            h-64
            w-64
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div className="relative z-10">

          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              backdrop-blur-xl
            "
          >

            <FolderKanban size={16} />

            Enterprise Project Analytics

          </div>

          <h1
            className="
              text-4xl
              md:text-5xl
              font-black
              tracking-tight
            "
          >

            Projects Dashboard

          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-blue-100
              text-lg
            "
          >

            Track project budgets,
            spending, financial
            progress, and operational
            performance in real-time.

          </p>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-5
          gap-6
        "
      >

        {/* TOTAL PROJECTS */}

        <div
          className="
            rounded-3xl
            bg-white
            p-6
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

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-blue-100
                flex
                items-center
                justify-center
              "
            >

              <Briefcase
                className="
                  text-blue-600
                "
              />

            </div>

            <span
              className="
                text-sm
                font-semibold
                text-slate-500
              "
            >

              Active

            </span>

          </div>

          <h2
            className="
              mt-5
              text-4xl
              font-black
              text-slate-800
            "
          >

            {
              stats.totalProjects
            }

          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >

            Total Projects

          </p>

        </div>

        {/* TOTAL BUDGET */}

        <div
          className="
            rounded-3xl
            bg-white
            p-6
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

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-emerald-100
                flex
                items-center
                justify-center
              "
            >

              <Wallet
                className="
                  text-emerald-600
                "
              />

            </div>

            <TrendingUp
              className="
                text-emerald-500
              "
            />

          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-black
              text-slate-800
            "
          >

            {
              formatCurrency(
                stats.totalBudget
              )
            }

          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >

            Total Budget

          </p>

        </div>

        {/* TOTAL SPENT */}

        <div
          className="
            rounded-3xl
            bg-white
            p-6
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

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-orange-100
                flex
                items-center
                justify-center
              "
            >

              <IndianRupee
                className="
                  text-orange-600
                "
              />

            </div>

            <BarChart3
              className="
                text-orange-500
              "
            />

          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-black
              text-slate-800
            "
          >

            {
              formatCurrency(
                stats.totalSpent
              )
            }

          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >

            Total Spent

          </p>

        </div>

        {/* REMAINING */}

        <div
          className="
            rounded-3xl
            bg-white
            p-6
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

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-cyan-100
                flex
                items-center
                justify-center
              "
            >

              <TrendingUp
                className="
                  text-cyan-600
                "
              />

            </div>

          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-black
              text-slate-800
            "
          >

            {
              formatCurrency(
                stats.totalRemaining
              )
            }

          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >

            Remaining

          </p>

        </div>

        {/* OVER BUDGET */}

        <div
          className="
            rounded-3xl
            bg-white
            p-6
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

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-red-100
                flex
                items-center
                justify-center
              "
            >

              <AlertTriangle
                className="
                  text-red-600
                "
              />

            </div>

          </div>

          <h2
            className="
              mt-5
              text-4xl
              font-black
              text-red-600
            "
          >

            {
              stats.overBudget
            }

          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >

            Over Budget

          </p>

        </div>

      </div>

      {/* PROJECTS */}

      <div
        className="
          rounded-[32px]
          bg-white
          shadow-xl
          border
          border-slate-100
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            px-8
            py-6
            border-b
            border-slate-100
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-black
                text-slate-800
              "
            >

              Project Financial Overview

            </h2>

            <p
              className="
                mt-1
                text-slate-500
              "
            >

              Live budget utilization
              and spending reports

            </p>

          </div>

          <button
            onClick={
              fetchProjects
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-slate-900
              px-5
              py-3
              text-white
              font-semibold
              hover:bg-slate-800
              transition-all
            "
          >

            <RefreshCw size={18} />

            Refresh

          </button>

        </div>

        {/* BODY */}

        {

          loading ? (

            <div
              className="
                flex
                items-center
                justify-center
                p-24
              "
            >

              <div className="text-center">

                <div
                  className="
                    mx-auto
                    h-14
                    w-14
                    animate-spin
                    rounded-full
                    border-4
                    border-blue-500
                    border-t-transparent
                  "
                />

                <p
                  className="
                    mt-6
                    text-lg
                    font-semibold
                    text-slate-600
                  "
                >

                  Loading projects...

                </p>

              </div>

            </div>

          ) : error ? (

            <div
              className="
                p-20
                text-center
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                  text-red-600
                "
              >

                {error}

              </h2>

            </div>

          ) : projects.length === 0 ? (

            <div
              className="
                p-20
                text-center
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                  text-slate-700
                "
              >

                No Projects Found

              </h2>

              <p
                className="
                  mt-3
                  text-slate-500
                "
              >

                Create projects to
                view analytics.

              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
                p-8
              "
            >

              {

                projects.map(
                  (project) => {

                    const progress =
                      getProgress(
                        Number(
                          project?.spent || 0
                        ),
                        Number(
                          project?.budget || 0
                        )
                      );

                    const status =
                      getStatus(
                        Number(
                          project?.spent || 0
                        ),
                        Number(
                          project?.budget || 0
                        )
                      );

                    return (

                      <div
                        key={
                          project._id
                        }
                        className="
                          rounded-3xl
                          border
                          border-slate-200
                          p-7
                          hover:shadow-xl
                          transition-all
                          duration-300
                        "
                      >

                        {/* TOP */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                          "
                        >

                          <div>

                            <h3
                              className="
                                text-2xl
                                font-black
                                text-slate-800
                              "
                            >

                              {
                                project?.name ||
                                "Untitled Project"
                              }

                            </h3>

                            <p
                              className="
                                mt-2
                                text-slate-500
                              "
                            >

                              Financial
                              tracking and
                              resource
                              monitoring

                            </p>

                          </div>

                          <span
                            className={`
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-bold
                              ${status.color}
                            `}
                          >

                            {
                              status.label
                            }

                          </span>

                        </div>

                        {/* STATS */}

                        <div
                          className="
                            mt-8
                            grid
                            grid-cols-2
                            gap-6
                          "
                        >

                          <div
                            className="
                              rounded-2xl
                              bg-slate-50
                              p-5
                            "
                          >

                            <p
                              className="
                                text-sm
                                text-slate-500
                              "
                            >

                              Budget

                            </p>

                            <h4
                              className="
                                mt-2
                                text-2xl
                                font-black
                                text-slate-800
                              "
                            >

                              {
                                formatCurrency(
                                  project?.budget
                                )
                              }

                            </h4>

                          </div>

                          <div
                            className="
                              rounded-2xl
                              bg-slate-50
                              p-5
                            "
                          >

                            <p
                              className="
                                text-sm
                                text-slate-500
                              "
                            >

                              Spent

                            </p>

                            <h4
                              className="
                                mt-2
                                text-2xl
                                font-black
                                text-slate-800
                              "
                            >

                              {
                                formatCurrency(
                                  project?.spent
                                )
                              }

                            </h4>

                          </div>

                        </div>

                        {/* PROGRESS */}

                        <div className="mt-8">

                          <div
                            className="
                              mb-3
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <p
                              className="
                                font-semibold
                                text-slate-700
                              "
                            >

                              Budget Usage

                            </p>

                            <p
                              className="
                                text-sm
                                font-bold
                                text-slate-600
                              "
                            >

                              {
                                progress
                              }%

                            </p>

                          </div>

                          <div
                            className="
                              h-4
                              overflow-hidden
                              rounded-full
                              bg-slate-200
                            "
                          >

                            <div
                              className={`
                                h-full
                                rounded-full
                                transition-all
                                duration-500
                                ${
                                  progress >= 100
                                    ? "bg-red-500"
                                    : progress >= 80
                                    ? "bg-yellow-500"
                                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                                }
                              `}
                              style={{
                                width:
                                  `${progress}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    );

                  }
                )

              }

            </div>

          )

        }

      </div>

    </div>

  );

}