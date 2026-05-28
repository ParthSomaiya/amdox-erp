import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Search,
  UserCheck,
  UserX,
  Clock3,
  RefreshCw,
} from "lucide-react";

import API from "../services/api";

export default function AttendanceReport() {
  // ================= STATE =================

  const [records, setRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // ================= FETCH REPORTS =================

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports =
    async () => {
      try {
        setLoading(true);

        const res =
          await API.get(
            "/attendance/report"
          );

        setRecords(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );
      } catch (err) {
        console.error(
          "Failed to fetch attendance reports:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  // ================= REFRESH =================

  const refreshReports =
    async () => {
      try {
        setRefreshing(true);

        await fetchReports();
      } finally {
        setRefreshing(false);
      }
    };

  // ================= FILTER =================

  const filteredRecords =
    useMemo(() => {
      return records.filter(
        (item) =>
          item?.userId?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [records, search]);

  // ================= STATS =================

  const totalPresent =
    records.filter(
      (item) =>
        item.status ===
        "PRESENT"
    ).length;

  const totalAbsent =
    records.filter(
      (item) =>
        item.status ===
        "ABSENT"
    ).length;

  const totalHalfDay =
    records.filter(
      (item) =>
        item.status ===
        "HALF_DAY"
    ).length;

  // ================= STATUS STYLE =================

  const getStatusStyle =
    (status) => {
      switch (status) {
        case "PRESENT":
          return `
            bg-emerald-100
            text-emerald-700
            border
            border-emerald-200
          `;

        case "ABSENT":
          return `
            bg-red-100
            text-red-700
            border
            border-red-200
          `;

        case "HALF_DAY":
          return `
            bg-amber-100
            text-amber-700
            border
            border-amber-200
          `;

        default:
          return `
            bg-slate-100
            text-slate-700
            border
            border-slate-200
          `;
      }
    };

  // ================= FORMAT DATE =================

  const formatDate =
    (date) => {
      if (!date) return "-";

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  return (
    <div className="space-y-8">
      {/* ================= HERO ================= */}

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
          md:p-10
          text-white
          shadow-2xl
        "
      >
        <div
          className="
            absolute
            top-0
            right-0
            h-56
            w-56
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
              border
              border-white/20
              bg-white/10
              px-4
              py-2
              text-sm
              font-medium
              backdrop-blur-lg
            "
          >
            <CalendarDays
              size={16}
            />

            Attendance Analytics
          </div>

          <h1
            className="
              text-4xl
              font-black
              tracking-tight
              md:text-5xl
            "
          >
            Attendance Reports
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-base
              text-cyan-100
              md:text-lg
            "
          >
            Monitor employee
            attendance, track
            presence trends,
            and analyze workforce
            productivity in
            real-time.
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-3
        "
      >
        {/* PRESENT */}

        <div
          className="
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-7
            shadow-lg
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
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Present
              </p>

              <h2
                className="
                  mt-4
                  text-5xl
                  font-black
                  text-emerald-600
                "
              >
                {totalPresent}
              </h2>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                bg-emerald-100
                text-emerald-600
              "
            >
              <UserCheck
                size={30}
              />
            </div>
          </div>
        </div>

        {/* ABSENT */}

        <div
          className="
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-7
            shadow-lg
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
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Absent
              </p>

              <h2
                className="
                  mt-4
                  text-5xl
                  font-black
                  text-red-600
                "
              >
                {totalAbsent}
              </h2>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                bg-red-100
                text-red-600
              "
            >
              <UserX
                size={30}
              />
            </div>
          </div>
        </div>

        {/* HALF DAY */}

        <div
          className="
            rounded-[28px]
            border
            border-slate-200
            bg-white
            p-7
            shadow-lg
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
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Half Day
              </p>

              <h2
                className="
                  mt-4
                  text-5xl
                  font-black
                  text-amber-500
                "
              >
                {totalHalfDay}
              </h2>
            </div>

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                bg-amber-100
                text-amber-600
              "
            >
              <Clock3
                size={30}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-[28px]
          border
          border-slate-200
          bg-white
          p-6
          shadow-lg
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* SEARCH */}

        <div className="relative w-full lg:max-w-md">
          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-slate-50
              pl-12
              pr-4
              text-sm
              outline-none
              transition-all
              focus:border-blue-500
              focus:bg-white
            "
          />
        </div>

        {/* REFRESH */}

        <button
          onClick={
            refreshReports
          }
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            px-6
            py-4
            text-sm
            font-bold
            text-white
            shadow-lg
            transition-all
            hover:scale-[1.02]
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div
        className="
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-12
            gap-4
            border-b
            border-slate-200
            bg-slate-100
            px-8
            py-5
            text-sm
            font-black
            uppercase
            tracking-wide
            text-slate-600
          "
        >
          <div className="col-span-4">
            Employee
          </div>

          <div className="col-span-4">
            Date
          </div>

          <div className="col-span-4">
            Status
          </div>
        </div>

        {/* BODY */}

        {loading ? (
          <div
            className="
              flex
              min-h-[350px]
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  mb-5
                  h-14
                  w-14
                  animate-spin
                  rounded-full
                  border-4
                  border-blue-500
                  border-t-transparent
                "
              />

              <h2
                className="
                  text-2xl
                  font-black
                  text-slate-700
                "
              >
                Loading Reports...
              </h2>
            </div>
          </div>
        ) : filteredRecords.length ===
          0 ? (
          <div
            className="
              flex
              min-h-[350px]
              items-center
              justify-center
              p-10
              text-center
            "
          >
            <div>
              <h2
                className="
                  text-3xl
                  font-black
                  text-slate-700
                "
              >
                No Reports Found
              </h2>

              <p
                className="
                  mt-3
                  text-slate-500
                "
              >
                No attendance
                records matched
                your search.
              </p>
            </div>
          </div>
        ) : (
          filteredRecords.map(
            (item) => (
              <div
                key={item._id}
                className="
                  grid
                  grid-cols-12
                  gap-4
                  border-b
                  border-slate-100
                  px-8
                  py-5
                  transition-all
                  hover:bg-slate-50
                "
              >
                {/* EMPLOYEE */}

                <div
                  className="
                    col-span-4
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-500
                      to-cyan-500
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    {item?.userId?.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "E"}
                  </div>

                  <div>
                    <h3
                      className="
                        text-base
                        font-bold
                        text-slate-800
                      "
                    >
                      {item?.userId
                        ?.name ||
                        "Employee"}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-slate-500
                      "
                    >
                      Employee
                      Attendance
                    </p>
                  </div>
                </div>

                {/* DATE */}

                <div
                  className="
                    col-span-4
                    flex
                    items-center
                    text-sm
                    font-semibold
                    text-slate-600
                  "
                >
                  {formatDate(
                    item.createdAt
                  )}
                </div>

                {/* STATUS */}

                <div
                  className="
                    col-span-4
                    flex
                    items-center
                  "
                >
                  <span
                    className={`
                      inline-flex
                      items-center
                      rounded-full
                      px-4
                      py-2
                      text-sm
                      font-bold
                      ${getStatusStyle(
                        item.status
                      )}
                    `}
                  >
                    {
                      item.status
                    }
                  </span>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}