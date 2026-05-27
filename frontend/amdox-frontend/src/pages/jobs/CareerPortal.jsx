import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function CareerPortal() {

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // =========================
  // FETCH JOBS
  // =========================

  useEffect(() => {

    fetchJobs();

  }, []);

  const fetchJobs = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          "http://localhost:5000/api/jobs"
        );

      if (Array.isArray(res.data)) {

        setJobs(res.data);

      } else {

        setJobs([]);

      }

    } catch (err) {

      console.log(err);

      setJobs([]);

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // FILTER
  // =========================

  const filteredJobs =
    jobs.filter((job) => {

      const title =
        job?.title || "";

      return title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    });

  return (

    <div className="min-h-screen bg-gray-100">

      {/* ================= HERO ================= */}

      <div
        className="
          bg-gradient-to-r
          from-blue-700
          to-cyan-500
          text-white
          p-10
        "
      >

        <h1 className="text-5xl font-black mb-4">

          Find Your Dream Job 🚀

        </h1>

        <p className="text-lg text-blue-100 mb-6">

          Explore latest career opportunities

        </p>

        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            md:w-1/2
            p-4
            rounded-2xl
            text-black
            outline-none
          "
        />

      </div>

      {/* ================= JOBS ================= */}

      <div className="p-8">

        {loading ? (

          <div className="text-center py-20">

            <h2 className="text-2xl font-bold">
              Loading Jobs...
            </h2>

          </div>

        ) : filteredJobs.length === 0 ? (

          <div
            className="
              bg-white
              rounded-3xl
              shadow
              p-10
              text-center
            "
          >

            <h2 className="text-3xl font-bold">

              No Jobs Found

            </h2>

            <p className="text-gray-500 mt-3">

              Try another search keyword

            </p>

          </div>

        ) : (

          <div
            className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            {filteredJobs.map((job) => (

              <div
                key={job._id}
                className="
                  bg-white
                  rounded-3xl
                  shadow-lg
                  p-6
                  hover:shadow-2xl
                  transition-all
                  duration-300
                "
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-2xl font-black">

                      {job?.title || "Job"}

                    </h2>

                    <p className="text-gray-500 mt-2">

                      {job?.company || "Company"}

                    </p>

                  </div>

                  <div
                    className="
                      bg-blue-100
                      text-blue-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-bold
                    "
                  >
                    Active
                  </div>

                </div>

                <p className="mt-5 text-gray-700 line-clamp-4">

                  {job?.description ||
                    "No Description"}

                </p>

                <div className="mt-6">

                  <p className="text-green-600 text-2xl font-black">

                    ₹{job?.salary || 0}

                  </p>

                </div>

                <a
                  href={`/apply-job/${job._id}`}
                  className="
                    mt-6
                    inline-block
                    w-full
                    text-center
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-3
                    rounded-2xl
                    font-semibold
                    transition-all
                  "
                >
                  Apply Now
                </a>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}