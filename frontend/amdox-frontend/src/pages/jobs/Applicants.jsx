import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../../services/api";

import {
  Mail,
  FileText,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  Briefcase,
  User2,
  Eye,
} from "lucide-react";

export default function Applicants() {

  // ================= STATE =================

  const [applicants, setApplicants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ================= FETCH APPLICANTS =================

  useEffect(() => {

    fetchApplicants();

  }, []);

  const fetchApplicants =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/jobs/applicants"
          );

        setApplicants(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.error(
          "Applicants Fetch Error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

  // ================= UPDATE STATUS =================

  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        await API.put(
          `/jobs/applicant/${id}`,
          { status }
        );

        setApplicants((prev) =>
          prev.map((item) =>

            item._id === id
              ? {
                  ...item,
                  status,
                }
              : item

          )
        );

      } catch (error) {

        console.error(
          "Status Update Error:",
          error
        );

        alert(
          "Failed to update application status"
        );

      }

    };

  // ================= FILTERED DATA =================

  const filteredApplicants =
    useMemo(() => {

      return applicants.filter(
        (item) => {

          const candidateName =
            item?.name
              ?.toLowerCase() || "";

          const candidateEmail =
            item?.email
              ?.toLowerCase() || "";

          const jobTitle =
            item?.jobId?.title
              ?.toLowerCase() || "";

          const searchText =
            search.toLowerCase();

          const matchesSearch =

            candidateName.includes(
              searchText
            ) ||

            candidateEmail.includes(
              searchText
            ) ||

            jobTitle.includes(
              searchText
            );

          const currentStatus =
            item.status || "PENDING";

          const matchesStatus =

            statusFilter === "ALL"
              ? true
              : currentStatus ===
                statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      applicants,
      search,
      statusFilter,
    ]);

  // ================= STATS =================

  const totalApplicants =
    applicants.length;

  const acceptedCount =
    applicants.filter(
      (item) =>
        item.status ===
        "ACCEPTED"
    ).length;

  const rejectedCount =
    applicants.filter(
      (item) =>
        item.status ===
        "REJECTED"
    ).length;

  const pendingCount =
    applicants.filter(
      (item) =>

        !item.status ||

        item.status ===
          "PENDING"

    ).length;

  // ================= STATUS UI =================

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "ACCEPTED":

          return `
            bg-emerald-100
            text-emerald-700
            border
            border-emerald-200
          `;

        case "REJECTED":

          return `
            bg-red-100
            text-red-700
            border
            border-red-200
          `;

        default:

          return `
            bg-amber-100
            text-amber-700
            border
            border-amber-200
          `;

      }

    };

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-cyan-600
          via-blue-600
          to-indigo-700
          p-10
          text-white
          shadow-2xl
        "
      >

        <div
          className="
            absolute
            right-0
            top-0
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
              font-semibold
              backdrop-blur-xl
            "
          >

            <Briefcase size={16} />

            Recruitment Management

          </div>

          <h1
            className="
              mt-6
              text-5xl
              font-black
              tracking-tight
            "
          >

            Applicants Dashboard

          </h1>

          <p
            className="
              mt-4
              max-w-3xl
              text-lg
              text-cyan-100
            "
          >

            Review candidate applications,
            manage recruitment pipeline,
            and streamline hiring operations.

          </p>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* TOTAL */}

        <div
          className="
            rounded-[28px]
            bg-white
            p-7
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
                Total Applicants
              </p>

              <h2
                className="
                  mt-3
                  text-5xl
                  font-black
                "
              >

                {totalApplicants}

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
                bg-blue-100
                text-blue-600
              "
            >

              <User2 size={30} />

            </div>

          </div>

        </div>

        {/* ACCEPTED */}

        <div
          className="
            rounded-[28px]
            bg-white
            p-7
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
                Accepted
              </p>

              <h2
                className="
                  mt-3
                  text-5xl
                  font-black
                  text-emerald-600
                "
              >

                {acceptedCount}

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

              <CheckCircle2
                size={30}
              />

            </div>

          </div>

        </div>

        {/* REJECTED */}

        <div
          className="
            rounded-[28px]
            bg-white
            p-7
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
                Rejected
              </p>

              <h2
                className="
                  mt-3
                  text-5xl
                  font-black
                  text-red-600
                "
              >

                {rejectedCount}

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

              <XCircle size={30} />

            </div>

          </div>

        </div>

        {/* PENDING */}

        <div
          className="
            rounded-[28px]
            bg-white
            p-7
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
                Pending
              </p>

              <h2
                className="
                  mt-3
                  text-5xl
                  font-black
                  text-amber-500
                "
              >

                {pendingCount}

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

              <Clock3 size={30} />

            </div>

          </div>

        </div>

      </div>

      {/* FILTER BAR */}

      <div
        className="
          flex
          flex-col
          gap-5
          rounded-[28px]
          bg-white
          p-6
          shadow-lg
          border
          border-slate-100
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* SEARCH */}

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
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
            placeholder="Search applicants..."
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
              border-slate-200
              bg-slate-50
              pl-12
              pr-5
              outline-none
              transition-all
              focus:border-blue-500
              focus:bg-white
            "
          />

        </div>

        {/* STATUS FILTER */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="
            h-14
            rounded-2xl
            border
            border-slate-200
            px-5
            outline-none
            focus:border-blue-500
          "
        >

          <option value="ALL">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="ACCEPTED">
            Accepted
          </option>

          <option value="REJECTED">
            Rejected
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-[32px]
          bg-white
          shadow-xl
          border
          border-slate-100
        "
      >

        {

          loading ? (

            <div
              className="
                flex
                h-[400px]
                items-center
                justify-center
              "
            >

              <div className="text-center">

                <div
                  className="
                    mx-auto
                    h-16
                    w-16
                    animate-spin
                    rounded-full
                    border-4
                    border-blue-200
                    border-t-blue-600
                  "
                />

                <h2
                  className="
                    mt-6
                    text-2xl
                    font-bold
                  "
                >

                  Loading Applicants...

                </h2>

              </div>

            </div>

          ) : filteredApplicants.length === 0 ? (

            <div
              className="
                p-20
                text-center
              "
            >

              <Clock3
                size={70}
                className="
                  mx-auto
                  text-slate-300
                "
              />

              <h2
                className="
                  mt-6
                  text-4xl
                  font-black
                "
              >

                No Applicants Found

              </h2>

              <p
                className="
                  mt-3
                  text-slate-500
                "
              >

                Candidate applications
                will appear here.

              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-slate-100
                  "
                >

                  <tr>

                    <th
                      className="
                        px-8
                        py-5
                        text-left
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-600
                      "
                    >

                      Candidate

                    </th>

                    <th
                      className="
                        px-8
                        py-5
                        text-left
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-600
                      "
                    >

                      Job Role

                    </th>

                    <th
                      className="
                        px-8
                        py-5
                        text-left
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-600
                      "
                    >

                      Applied Date

                    </th>

                    <th
                      className="
                        px-8
                        py-5
                        text-left
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-600
                      "
                    >

                      Status

                    </th>

                    <th
                      className="
                        px-8
                        py-5
                        text-left
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-600
                      "
                    >

                      Resume

                    </th>

                    <th
                      className="
                        px-8
                        py-5
                        text-left
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-600
                      "
                    >

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    filteredApplicants.map(
                      (
                        applicant
                      ) => (

                        <tr
                          key={
                            applicant._id
                          }
                          className="
                            border-b
                            border-slate-100
                            transition-all
                            hover:bg-slate-50
                          "
                        >

                          {/* CANDIDATE */}

                          <td className="px-8 py-6">

                            <div>

                              <h3
                                className="
                                  text-lg
                                  font-black
                                "
                              >

                                {
                                  applicant.name
                                }

                              </h3>

                              <div
                                className="
                                  mt-2
                                  flex
                                  items-center
                                  gap-2
                                  text-slate-500
                                "
                              >

                                <Mail
                                  size={16}
                                />

                                <span>

                                  {
                                    applicant.email
                                  }

                                </span>

                              </div>

                            </div>

                          </td>

                          {/* JOB */}

                          <td className="px-8 py-6">

                            <div>

                              <h3
                                className="
                                  font-bold
                                "
                              >

                                {

                                  applicant
                                    ?.jobId
                                    ?.title ||

                                  "Job Position"

                                }

                              </h3>

                              <p
                                className="
                                  mt-2
                                  text-sm
                                  text-slate-500
                                "
                              >

                                AMDOX ERP

                              </p>

                            </div>

                          </td>

                          {/* DATE */}

                          <td className="px-8 py-6">

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                text-slate-600
                              "
                            >

                              <CalendarDays
                                size={17}
                              />

                              <span>

                                {

                                  new Date(
                                    applicant.createdAt
                                  ).toLocaleDateString()

                                }

                              </span>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-8 py-6">

                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-2xl
                                px-4
                                py-2
                                text-sm
                                font-bold
                                ${getStatusStyle(
                                  applicant.status
                                )}
                              `}
                            >

                              {

                                applicant.status ||

                                "PENDING"

                              }

                            </span>

                          </td>

                          {/* RESUME */}

                          <td className="px-8 py-6">

                            <a
                              href={`http://localhost:5000/${applicant.resume}`}
                              target="_blank"
                              rel="noreferrer"
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-2xl
                                bg-blue-100
                                px-4
                                py-2
                                font-semibold
                                text-blue-700
                                transition-all
                                hover:bg-blue-200
                              "
                            >

                              <Eye size={16} />

                              View Resume

                            </a>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-8 py-6">

                            <div
                              className="
                                flex
                                flex-wrap
                                gap-3
                              "
                            >

                              <button
                                onClick={() =>
                                  updateStatus(
                                    applicant._id,
                                    "ACCEPTED"
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-2xl
                                  bg-emerald-500
                                  px-5
                                  py-3
                                  font-bold
                                  text-white
                                  transition-all
                                  hover:bg-emerald-600
                                "
                              >

                                <CheckCircle2
                                  size={17}
                                />

                                Accept

                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(
                                    applicant._id,
                                    "REJECTED"
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-2xl
                                  bg-red-500
                                  px-5
                                  py-3
                                  font-bold
                                  text-white
                                  transition-all
                                  hover:bg-red-600
                                "
                              >

                                <XCircle
                                  size={17}
                                />

                                Reject

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  }

                </tbody>

              </table>

            </div>

          )

        }

      </div>

    </div>

  );

}