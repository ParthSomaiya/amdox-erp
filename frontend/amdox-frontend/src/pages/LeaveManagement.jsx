import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock3,
  Search,
  XCircle,
} from "lucide-react";

import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ================= FETCH LEAVES =================

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leave");

      setLeaves(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) =>
      leave?.employeeId?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [leaves, search]);

  // ================= UPDATE STATUS =================

  const updateStatus = async (
    leaveId,
    status
  ) => {
    try {
      setUpdatingId(leaveId);

      await API.post("/leave/update", {
        leaveId,
        status,
      });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId
            ? { ...leave, status }
            : leave
        )
      );
    } catch (err) {
      console.log(err);

      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= STATUS STYLE =================

  const statusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ================= STATS =================

  const totalLeaves = leaves.length;

  const approvedLeaves =
    leaves.filter(
      (l) => l.status === "APPROVED"
    ).length;

  const pendingLeaves =
    leaves.filter(
      (l) =>
        !l.status ||
        l.status === "PENDING"
    ).length;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HERO */}

        <div
          className="
            rounded-3xl
            bg-gradient-to-r
            from-indigo-600
            via-blue-600
            to-cyan-500
            p-8
            text-white
            shadow-xl
          "
        >
          <h1 className="text-4xl font-black">
            Leave Management
          </h1>

          <p className="mt-2 text-cyan-100">
            Approve and manage employee
            leave requests
          </p>
        </div>

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-3
          "
        >
          {/* TOTAL */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-lg
            "
          >
            <p className="text-gray-500">
              Total Requests
            </p>

            <h2
              className="
                mt-3
                text-5xl
                font-black
                text-indigo-600
              "
            >
              {totalLeaves}
            </h2>
          </div>

          {/* APPROVED */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-lg
            "
          >
            <p className="text-gray-500">
              Approved
            </p>

            <h2
              className="
                mt-3
                text-5xl
                font-black
                text-green-600
              "
            >
              {approvedLeaves}
            </h2>
          </div>

          {/* PENDING */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-lg
            "
          >
            <p className="text-gray-500">
              Pending
            </p>

            <h2
              className="
                mt-3
                text-5xl
                font-black
                text-yellow-500
              "
            >
              {pendingLeaves}
            </h2>
          </div>
        </div>

        {/* SEARCH */}

        <div
          className="
            rounded-3xl
            bg-white
            p-5
            shadow-lg
          "
        >
          <div className="relative">
            <Search
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              size={20}
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
                rounded-2xl
                border
                border-gray-300
                py-4
                pl-12
                pr-5
                outline-none
                transition-all
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* TABLE */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-xl
          "
        >
          {/* HEADER */}

          <div
            className="
              hidden
              grid-cols-12
              bg-slate-100
              px-8
              py-5
              text-sm
              font-bold
              uppercase
              text-gray-600
              lg:grid
            "
          >
            <div className="col-span-2">
              Employee
            </div>

            <div className="col-span-2">
              Leave Type
            </div>

            <div className="col-span-2">
              Dates
            </div>

            <div className="col-span-3">
              Reason
            </div>

            <div className="col-span-1">
              Status
            </div>

            <div className="col-span-2">
              Actions
            </div>
          </div>

          {/* BODY */}

          {loading ? (
            <div className="p-20 text-center">
              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Loading leave requests...
              </h2>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="p-20 text-center">
              <Clock3
                className="
                  mx-auto
                  mb-5
                  text-gray-300
                "
                size={60}
              />

              <h2
                className="
                  text-3xl
                  font-black
                "
              >
                No Leave Requests
              </h2>
            </div>
          ) : (
            filteredLeaves.map((leave) => (
              <div
                key={leave._id}
                className="
                  border-b
                  p-6
                  transition-all
                  hover:bg-slate-50
                "
              >
                {/* MOBILE */}

                <div className="space-y-5 lg:hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold">
                        {
                          leave
                            ?.employeeId
                            ?.name
                        }
                      </h2>

                      <p className="text-sm text-gray-500">
                        {
                          leave.leaveType
                        }
                      </p>
                    </div>

                    <span
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-xs
                        font-bold
                        ${statusStyle(
                          leave.status
                        )}
                      `}
                    >
                      {leave.status ||
                        "PENDING"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>
                      From:
                      {" "}
                      {new Date(
                        leave.fromDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      To:
                      {" "}
                      {new Date(
                        leave.toDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-gray-600">
                    {leave.reason}
                  </p>

                  <div className="flex gap-3">
                    <button
                      disabled={
                        updatingId ===
                        leave._id
                      }
                      onClick={() =>
                        updateStatus(
                          leave._id,
                          "APPROVED"
                        )
                      }
                      className="
                        flex-1
                        rounded-xl
                        bg-green-600
                        px-4
                        py-3
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-green-700
                      "
                    >
                      Approve
                    </button>

                    <button
                      disabled={
                        updatingId ===
                        leave._id
                      }
                      onClick={() =>
                        updateStatus(
                          leave._id,
                          "REJECTED"
                        )
                      }
                      className="
                        flex-1
                        rounded-xl
                        bg-red-600
                        px-4
                        py-3
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-red-700
                      "
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* DESKTOP */}

                <div
                  className="
                    hidden
                    grid-cols-12
                    items-center
                    gap-4
                    lg:grid
                  "
                >
                  <div className="col-span-2">
                    <h2 className="font-bold">
                      {
                        leave
                          ?.employeeId
                          ?.name
                      }
                    </h2>
                  </div>

                  <div className="col-span-2">
                    <span
                      className="
                        rounded-full
                        bg-blue-100
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-blue-700
                      "
                    >
                      {
                        leave.leaveType
                      }
                    </span>
                  </div>

                  <div
                    className="
                      col-span-2
                      text-sm
                      text-gray-600
                    "
                  >
                    <p>
                      {new Date(
                        leave.fromDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      {new Date(
                        leave.toDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className="
                      col-span-3
                      text-gray-600
                    "
                  >
                    {leave.reason}
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-xs
                        font-bold
                        ${statusStyle(
                          leave.status
                        )}
                      `}
                    >
                      {leave.status ||
                        "PENDING"}
                    </span>
                  </div>

                  <div
                    className="
                      col-span-2
                      flex
                      gap-3
                    "
                  >
                    <button
                      disabled={
                        updatingId ===
                        leave._id
                      }
                      onClick={() =>
                        updateStatus(
                          leave._id,
                          "APPROVED"
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-green-600
                        px-4
                        py-2
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-green-700
                      "
                    >
                      <CheckCircle
                        size={16}
                      />

                      Approve
                    </button>

                    <button
                      disabled={
                        updatingId ===
                        leave._id
                      }
                      onClick={() =>
                        updateStatus(
                          leave._id,
                          "REJECTED"
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-red-600
                        px-4
                        py-2
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-red-700
                      "
                    >
                      <XCircle
                        size={16}
                      />

                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
