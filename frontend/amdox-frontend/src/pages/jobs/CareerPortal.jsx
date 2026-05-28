import {
  useEffect,
  useState,
} from "react";

import {
  MapPin,
  Briefcase,
  IndianRupee,
  Search,
} from "lucide-react";

import API from "../../services/api";

export default function CareerPortal() {

  // ================= STATE =================

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ================= FETCH JOBS =================

  useEffect(() => {

    fetchJobs();

  }, []);

  const fetchJobs =
    async () => {

      try {

        const res =
          await API.get(
            "/jobs"
          );

        setJobs(res.data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= FILTER =================

  const filteredJobs =
    jobs.filter((job) =>

      job.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  return (

    <div className="min-h-screen bg-slate-100">

      {/* HERO */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-r
          from-cyan-600
          via-blue-600
          to-indigo-700
          px-6
          py-20
          text-white
        "
      >

        {/* GLOW */}

        <div
          className="
            absolute
            top-0
            right-0
            h-96
            w-96
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            max-w-7xl
            mx-auto
          "
        >

          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
              leading-tight
            "
          >

            Find Your
            <br />

            Dream Career

          </h1>

          <p
            className="
              mt-5
              text-lg
              text-cyan-100
              max-w-2xl
            "
          >

            Join top companies and
            build your future with
            AMDOX Career Portal.

          </p>

          {/* SEARCH */}

          <div
            className="
              mt-10
              flex
              items-center
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-2xl
              max-w-2xl
            "
          >

            <div className="px-5">

              <Search
                className="text-gray-500"
              />

            </div>

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
                flex-1
                h-16
                px-2
                outline-none
                text-black
                text-lg
              "
            />

          </div>

        </div>

      </div>

      {/* JOBS */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-14
        "
      >

        {/* TITLE */}

        <div className="mb-10">

          <h2
            className="
              text-4xl
              font-black
              text-slate-800
            "
          >

            Open Positions

          </h2>

          <p className="text-gray-500 mt-3">

            Explore latest career
            opportunities

          </p>

        </div>

        {/* LOADING */}

        {
          loading && (

            <div
              className="
                text-center
                py-20
                text-xl
                font-semibold
              "
            >

              Loading jobs...

            </div>

          )
        }

        {/* EMPTY */}

        {
          !loading &&
          filteredJobs.length === 0 && (

            <div
              className="
                bg-white
                rounded-3xl
                shadow-lg
                p-20
                text-center
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                "
              >

                No Jobs Found

              </h2>

              <p className="text-gray-500 mt-4">

                Try another keyword

              </p>

            </div>

          )
        }

        {/* JOB GRID */}

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
            filteredJobs.map((job) => (

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
                  border-slate-100
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

                    <h2
                      className="
                        text-2xl
                        font-black
                        text-slate-800
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

                      {job.company ||
                        "AMDOX ERP"}

                    </p>

                  </div>

                  <div
                    className="
                      h-16
                      w-16
                      rounded-2xl
                      bg-gradient-to-r
                      from-cyan-500
                      to-blue-600
                      flex
                      items-center
                      justify-center
                      text-white
                      text-3xl
                    "
                  >

                    💼

                  </div>

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

                {/* DETAILS */}

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

                    <MapPin size={18} />

                    <span>

                      {
                        job.location ||
                        "Ahmedabad"
                      }

                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-gray-600
                    "
                  >

                    <Briefcase size={18} />

                    <span>

                      {
                        job.type ||
                        "Full Time"
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

                    <IndianRupee size={18} />

                    <span>

                      {
                        job.salary ||
                        "Negotiable"
                      }

                    </span>

                  </div>

                </div>

                {/* BUTTON */}

                <a

                  href={`/apply-job/${job._id}`}

                  className="
                    mt-8
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    text-white
                    font-bold
                    flex
                    items-center
                    justify-center
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                  "
                >

                  Apply Now

                </a>

              </div>

            ))
          }

        </div>

      </div>

    </div>

  );

}