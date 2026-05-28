import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  TimerReset,
  Users,
} from "lucide-react";

import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [todayStatus, setTodayStatus] =
    useState("PRESENT");

  const [marking, setMarking] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ============================================
  // FETCH ATTENDANCE
  // ============================================

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/attendance"
      );

      setAttendance(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Attendance fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MARK ATTENDANCE
  // ============================================

  const markAttendance = async () => {
    try {
      setMarking(true);

      await API.post("/attendance", {
        status: todayStatus,
      });

      await fetchAttendance();

      alert(
        "Attendance marked successfully"
      );
    } catch (error) {
      console.error(
        "Mark attendance error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to mark attendance"
      );
    } finally {
      setMarking(false);
    }
  };

  // ============================================
  // FILTERED DATA
  // ============================================

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) =>
      item?.employeeId?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [attendance, search]);

  // ============================================
  // STATS
  // ============================================

  const totalPresent = attendance.filter(
    (item) =>
      item.status === "PRESENT"
  ).length;

  const totalAbsent = attendance.filter(
    (item) =>
      item.status === "ABSENT"
  ).length;

  const totalHalfDay = attendance.filter(
    (item) =>
      item.status === "HALF_DAY"
  ).length;

  // ============================================
  // STATUS BADGE
  // ============================================

  const getStatusStyles = (status) => {
    switch (status) {
      case "PRESENT":
        return `
          bg-green-100
          text-green-700
          border
          border-green-200
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
          bg-yellow-100
          text-yellow-700
          border
          border-yellow-200
        `;

      default:
        return `
          bg-gray-100
          text-gray-700
          border
          border-gray-200
        `;
    }
  };

  // ============================================
  // LOADER
  // ============================================

  if (loading) {
    return (
      <MainLayout>
        <div
          className="
            flex
            items-center
            justify-center
            min-h-[70vh]
          "
        >
          <div className="text-center">
            <div
              className="
                h-16
                w-16
                border-4
                border-emerald-500
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
                font-bold
                text-gray-700
              "
            >
              Loading Attendance...
            </h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            bg-gradient-to-r
            from-emerald-600
            via-teal-500
            to-cyan-500
            p-8
            lg:p-10
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

          <div
            className="
              relative
              z-10
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-8
            "
          >
            <div>
              <p
                className="
                  text-sm
                  uppercase
                  tracking-[4px]
                  text-cyan-100
                  font-semibold
                "
              >
                Employee Attendance
              </p>

              <h1
                className="
                  mt-3
                  text-4xl
                  lg:text-5xl
                  font-black
                "
              >
                Attendance Management
              </h1>

              <p
                className="
                  mt-4
                  text-cyan-100
                  text-lg
                  max-w-2xl
                "
              >
                Track, monitor and manage
                employee attendance records
                professionally.
              </p>
            </div>

            <div
              className="
                hidden
                lg:flex
                items-center
                justify-center
                h-32
                w-32
                rounded-3xl
                bg-white/15
                backdrop-blur-md
              "
            >
              <Calendar size={60} />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* STATS */}
        {/* ============================================ */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >
          {/* PRESENT */}

          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-lg
              border
              border-gray-100
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
                <p className="text-gray-500">
                  Present
                </p>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-green-600
                  "
                >
                  {totalPresent}
                </h2>
              </div>

              <div
                className="
                  h-16
                  w-16
                  rounded-2xl
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >
                <CheckCircle2
                  size={30}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          {/* ABSENT */}

          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-lg
              border
              border-gray-100
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
                <p className="text-gray-500">
                  Absent
                </p>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-red-600
                  "
                >
                  {totalAbsent}
                </h2>
              </div>

              <div
                className="
                  h-16
                  w-16
                  rounded-2xl
                  bg-red-100
                  flex
                  items-center
                  justify-center
                "
              >
                <XCircle
                  size={30}
                  className="text-red-600"
                />
              </div>
            </div>
          </div>

          {/* HALF DAY */}

          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-lg
              border
              border-gray-100
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
                <p className="text-gray-500">
                  Half Day
                </p>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-yellow-500
                  "
                >
                  {totalHalfDay}
                </h2>
              </div>

              <div
                className="
                  h-16
                  w-16
                  rounded-2xl
                  bg-yellow-100
                  flex
                  items-center
                  justify-center
                "
              >
                <TimerReset
                  size={30}
                  className="text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* ACTION BAR */}
        {/* ============================================ */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border
            border-gray-100
            p-6
            flex
            flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-6
          "
        >
          {/* SEARCH */}

          <div className="relative w-full xl:w-[380px]">
            <Search
              size={20}
              className="
                absolute
                top-1/2
                left-5
                -translate-y-1/2
                text-gray-400
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
                w-full
                h-14
                rounded-2xl
                border
                border-gray-300
                pl-14
                pr-5
                outline-none
                focus:border-emerald-500
                transition-all
              "
            />
          </div>

          {/* MARK ATTENDANCE */}

          {user?.role ===
            "EMPLOYEE" && (
            <div
              className="
                flex
                flex-col
                md:flex-row
                gap-4
              "
            >
              <select
                value={todayStatus}
                onChange={(e) =>
                  setTodayStatus(
                    e.target.value
                  )
                }
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  px-5
                  outline-none
                  focus:border-emerald-500
                "
              >
                <option value="PRESENT">
                  PRESENT
                </option>

                <option value="HALF_DAY">
                  HALF DAY
                </option>

                <option value="ABSENT">
                  ABSENT
                </option>
              </select>

              <button
                onClick={markAttendance}
                disabled={marking}
                className="
                  h-14
                  px-8
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-teal-500
                  text-white
                  font-bold
                  shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  disabled:opacity-50
                "
              >
                {marking
                  ? "Marking..."
                  : "Mark Attendance"}
              </button>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TABLE */}
        {/* ============================================ */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-100
            overflow-hidden
          "
        >
          {/* TABLE HEADER */}

          <div
            className="
              hidden
              lg:grid
              grid-cols-12
              bg-slate-100
              px-8
              py-5
              text-sm
              uppercase
              tracking-wide
              font-bold
              text-gray-600
            "
          >
            <div className="col-span-4">
              Employee
            </div>

            <div className="col-span-3">
              Date
            </div>

            <div className="col-span-3">
              Status
            </div>

            <div className="col-span-2">
              Time
            </div>
          </div>

          {/* EMPTY */}

          {filteredAttendance.length ===
          0 ? (
            <div className="p-20 text-center">
              <div
                className="
                  h-24
                  w-24
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
              >
                <Users
                  size={40}
                  className="text-gray-400"
                />
              </div>

              <h2
                className="
                  mt-6
                  text-3xl
                  font-black
                  text-gray-700
                "
              >
                No Attendance Records
              </h2>

              <p
                className="
                  mt-3
                  text-gray-500
                "
              >
                Attendance records will
                appear here.
              </p>
            </div>
          ) : (
            filteredAttendance.map(
              (item) => (
                <div
                  key={item._id}
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-12
                    gap-5
                    px-8
                    py-6
                    border-b
                    hover:bg-slate-50
                    transition-all
                  "
                >
                  {/* EMPLOYEE */}

                  <div className="lg:col-span-4">
                    <p
                      className="
                        text-xs
                        text-gray-400
                        uppercase
                        mb-1
                        lg:hidden
                      "
                    >
                      Employee
                    </p>

                    <h3
                      className="
                        text-lg
                        font-bold
                        text-gray-800
                      "
                    >
                      {item?.employeeId
                        ?.name ||
                        "Employee"}
                    </h3>
                  </div>

                  {/* DATE */}

                  <div className="lg:col-span-3">
                    <p
                      className="
                        text-xs
                        text-gray-400
                        uppercase
                        mb-1
                        lg:hidden
                      "
                    >
                      Date
                    </p>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-gray-600
                      "
                    >
                      <Calendar
                        size={16}
                      />

                      <span>
                        {new Date(
                          item.date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="lg:col-span-3">
                    <p
                      className="
                        text-xs
                        text-gray-400
                        uppercase
                        mb-1
                        lg:hidden
                      "
                    >
                      Status
                    </p>

                    <span
                      className={`
                        inline-flex
                        items-center
                        px-4
                        py-2
                        rounded-full
                        text-xs
                        font-bold
                        ${getStatusStyles(
                          item.status
                        )}
                      `}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* TIME */}

                  <div className="lg:col-span-2">
                    <p
                      className="
                        text-xs
                        text-gray-400
                        uppercase
                        mb-1
                        lg:hidden
                      "
                    >
                      Time
                    </p>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-gray-600
                      "
                    >
                      <Clock
                        size={16}
                      />

                      <span>
                        {new Date(
                          item.createdAt
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
}