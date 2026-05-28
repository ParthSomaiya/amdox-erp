import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../services/api";

import {
  Plus,
  Briefcase,
  MapPin,
  IndianRupee,
  Trash2,
  Search,
  Building2,
  Users,
  Loader2,
  Eye,
} from "lucide-react";

export default function Jobs() {

  // ================= STATE =================

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState({

      title: "",
      description: "",
      location: "",
      salary: "",
      type: "FULL_TIME",

    });

  // ================= FETCH JOBS =================

  useEffect(() => {

    fetchJobs();

  }, []);

  const fetchJobs =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/jobs"
          );

        setJobs(
          res.data || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= HANDLE CHANGE =================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };

  // ================= CREATE JOB =================

  const createJob =
    async (e) => {

      e.preventDefault();

      try {

        setCreating(true);

        await API.post(
          "/jobs",
          {
            ...form,
            salary:
              Number(
                form.salary
              ),
          }
        );

        setForm({

          title: "",
          description: "",
          location: "",
          salary: "",
          type: "FULL_TIME",

        });

        fetchJobs();

      } catch (err) {

        console.log(err);

        alert(

          err.response?.data
            ?.message ||

          "Failed to create job"

        );

      } finally {

        setCreating(false);

      }

    };

  // ================= DELETE JOB =================

  const deleteJob =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this job?"
        );

      if (!confirmDelete)
        return;

      try {

        await API.delete(
          `/jobs/${id}`
        );

        setJobs((prev) =>
          prev.filter(
            (job) =>
              job._id !== id
          )
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to delete job"
        );

      }

    };

  // ================= FILTER =================

  const filteredJobs =
    useMemo(() => {

      return jobs.filter(
        (job) =>

          job.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          job.location
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          job.type
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [jobs, search]);

  // ================= JOB TYPE STYLE =================

  const jobTypeStyle =
    (type) => {

      switch (type) {

        case "FULL_TIME":

          return `
            bg-green-100
            text-green-700
          `;

        case "PART_TIME":

          return `
            bg-yellow-100
            text-yellow-700
          `;

        case "INTERNSHIP":

          return `
            bg-blue-100
            text-blue-700
          `;

        case "REMOTE":

          return `
            bg-purple-100
            text-purple-700
          `;

        default:

          return `
            bg-gray-100
            text-gray-700
          `;

      }

    };

  // ================= STATS =================

  const fullTimeJobs =
    jobs.filter(
      (j) =>
        j.type ===
        "FULL_TIME"
    ).length;

  const internshipJobs =
    jobs.filter(
      (j) =>
        j.type ===
        "INTERNSHIP"
    ).length;

  return (

    <div className="space-y-8">

      {/* HERO */}

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
            h-72
            w-72
            bg-white/10
            rounded-full
            blur-3xl
          "
        />

        <div className="relative z-10">

          <h1
            className="
              text-5xl
              font-black
            "
          >

            Recruitment Portal

          </h1>

          <p
            className="
              mt-4
              text-cyan-100
              text-lg
              max-w-2xl
            "
          >

            Create, manage and
            publish professional
            company job openings

          </p>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            p-6
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

              <p className="text-gray-500">

                Total Jobs

              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  mt-3
                "
              >

                {jobs.length}

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
              "
            >

              <Briefcase
                className="
                  text-cyan-600
                "
                size={30}
              />

            </div>

          </div>

        </div>

        <div
          className="
            bg-white
            rounded-3xl
            p-6
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

              <p className="text-gray-500">

                Full Time

              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  mt-3
                  text-green-600
                "
              >

                {fullTimeJobs}

              </h2>

            </div>

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-green-100
                flex
                items-center
                justify-center
              "
            >

              <Building2
                className="
                  text-green-600
                "
                size={30}
              />

            </div>

          </div>

        </div>

        <div
          className="
            bg-white
            rounded-3xl
            p-6
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

              <p className="text-gray-500">

                Internships

              </p>

              <h2
                className="
                  text-5xl
                  font-black
                  mt-3
                  text-blue-600
                "
              >

                {internshipJobs}

              </h2>

            </div>

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-blue-100
                flex
                items-center
                justify-center
              "
            >

              <Users
                className="
                  text-blue-600
                "
                size={30}
              />

            </div>

          </div>

        </div>

      </div>

      {/* CREATE FORM */}

      <div
        className="
          bg-white
          rounded-[32px]
          shadow-xl
          p-10
        "
      >

        <div
          className="
            flex
            items-center
            gap-5
            mb-10
          "
        >

          <div
            className="
              h-16
              w-16
              rounded-3xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              flex
              items-center
              justify-center
              text-white
            "
          >

            <Plus size={30} />

          </div>

          <div>

            <h2
              className="
                text-3xl
                font-black
              "
            >

              Create New Job

            </h2>

            <p className="text-gray-500 mt-1">

              Publish a new vacancy
              for candidates

            </p>

          </div>

        </div>

        <form
          onSubmit={createJob}
          className="space-y-6"
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* TITLE */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                "
              >

                Job Title

              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={
                  handleChange
                }
                required
                placeholder="Frontend Developer"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  px-5
                  outline-none
                  focus:border-cyan-500
                "
              />

            </div>

            {/* LOCATION */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                "
              >

                Location

              </label>

              <input
                type="text"
                name="location"
                value={
                  form.location
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Ahmedabad"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  px-5
                  outline-none
                  focus:border-cyan-500
                "
              />

            </div>

            {/* SALARY */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                "
              >

                Salary

              </label>

              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={
                  handleChange
                }
                required
                placeholder="50000"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  px-5
                  outline-none
                  focus:border-cyan-500
                "
              />

            </div>

            {/* TYPE */}

            <div>

              <label
                className="
                  block
                  font-semibold
                  mb-3
                "
              >

                Job Type

              </label>

              <select
                name="type"
                value={form.type}
                onChange={
                  handleChange
                }
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  px-5
                  outline-none
                  focus:border-cyan-500
                "
              >

                <option value="FULL_TIME">
                  Full Time
                </option>

                <option value="PART_TIME">
                  Part Time
                </option>

                <option value="INTERNSHIP">
                  Internship
                </option>

                <option value="REMOTE">
                  Remote
                </option>

              </select>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label
              className="
                block
                font-semibold
                mb-3
              "
            >

              Description

            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              required
              rows={6}
              placeholder="Write job description..."
              className="
                w-full
                rounded-3xl
                border
                border-gray-300
                p-5
                outline-none
                resize-none
                focus:border-cyan-500
              "
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={creating}
            className="
              h-14
              px-10
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-bold
              hover:scale-[1.02]
              transition-all
              duration-300
              disabled:opacity-50
              flex
              items-center
              gap-3
            "
          >

            {

              creating ? (

                <>

                  <Loader2
                    className="
                      animate-spin
                    "
                    size={20}
                  />

                  Publishing...

                </>

              ) : (

                <>

                  <Plus size={20} />

                  Publish Job

                </>

              )

            }

          </button>

        </form>

      </div>

      {/* SEARCH */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          p-5
        "
      >

        <div className="relative">

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
            placeholder="Search jobs..."
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
              focus:border-cyan-500
            "
          />

        </div>

      </div>

      {/* JOB LIST */}

      {

        loading ? (

          <div
            className="
              bg-white
              rounded-[32px]
              shadow-lg
              p-24
              text-center
            "
          >

            <Loader2
              className="
                animate-spin
                mx-auto
                text-cyan-600
              "
              size={50}
            />

            <h2
              className="
                text-3xl
                font-black
                mt-6
              "
            >

              Loading Jobs...

            </h2>

          </div>

        ) : filteredJobs.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[32px]
              shadow-lg
              p-24
              text-center
            "
          >

            <Briefcase
              size={60}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h2
              className="
                text-4xl
                font-black
                mt-6
              "
            >

              No Jobs Found

            </h2>

            <p
              className="
                text-gray-500
                mt-4
              "
            >

              Create your first job
              posting

            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {

              filteredJobs.map(
                (job) => (

                  <div
                    key={job._id}
                    className="
                      bg-white
                      rounded-[32px]
                      shadow-lg
                      p-8
                      hover:shadow-2xl
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      border
                      border-gray-100
                    "
                  >

                    {/* TOP */}

                    <div
                      className="
                        flex
                        justify-between
                        items-start
                        gap-5
                      "
                    >

                      <div>

                        <h2
                          className="
                            text-2xl
                            font-black
                          "
                        >

                          {job.title}

                        </h2>

                        <p
                          className="
                            text-cyan-600
                            font-semibold
                            mt-2
                          "
                        >

                          AMDOX ERP

                        </p>

                      </div>

                      <div
                        className="
                          h-16
                          w-16
                          rounded-3xl
                          bg-gradient-to-r
                          from-cyan-500
                          to-blue-600
                          flex
                          items-center
                          justify-center
                          text-white
                          shrink-0
                        "
                      >

                        <Briefcase
                          size={30}
                        />

                      </div>

                    </div>

                    {/* JOB TYPE */}

                    <div className="mt-5">

                      <span
                        className={`
                          px-4
                          py-2
                          rounded-full
                          text-sm
                          font-bold
                          ${jobTypeStyle(
                            job.type
                          )}
                        `}
                      >

                        {

                          job.type?.replace(
                            "_",
                            " "
                          )

                        }

                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        text-gray-600
                        mt-6
                        leading-7
                        line-clamp-4
                      "
                    >

                      {

                        job.description

                      }

                    </p>

                    {/* INFO */}

                    <div
                      className="
                        mt-8
                        space-y-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          text-gray-600
                        "
                      >

                        <MapPin
                          size={18}
                        />

                        <span>

                          {

                            job.location

                          }

                        </span>

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          text-green-600
                          font-bold
                        "
                      >

                        <IndianRupee
                          size={18}
                        />

                        <span>

                          ₹{

                            job.salary

                          }

                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        mt-8
                        flex
                        gap-4
                      "
                    >

                      <button
                        className="
                          flex-1
                          h-12
                          rounded-2xl
                          bg-gradient-to-r
                          from-cyan-500
                          to-blue-600
                          text-white
                          font-bold
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >

                        <Eye size={18} />

                        Applicants

                      </button>

                      <button
                        onClick={() =>
                          deleteJob(
                            job._id
                          )
                        }
                        className="
                          h-12
                          w-12
                          rounded-2xl
                          bg-red-500
                          hover:bg-red-600
                          text-white
                          flex
                          items-center
                          justify-center
                          transition-all
                        "
                      >

                        <Trash2
                          size={18}
                        />

                      </button>

                    </div>

                  </div>

                )
              )

            }

          </div>

        )

      }

    </div>

  );

}