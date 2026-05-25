import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function CareerPortal() {

  const [jobs, setJobs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchJobs();

  }, []);

  const fetchJobs =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/jobs"
          );

        setJobs(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  const filtered =
    jobs.filter((job) =>
      job.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HERO */}

      <div className="bg-blue-700 text-white p-10">

        <h1 className="text-4xl font-bold mb-4">

          Find Your Dream Job

        </h1>

        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-1/2 p-3 rounded text-black"
        />

      </div>

      {/* JOBS */}

      <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered.map((job) => (

          <div
            key={job._id}
            className="bg-white rounded-xl shadow p-5"
          >

            <h2 className="text-2xl font-bold">

              {job.title}

            </h2>

            <p className="text-gray-500 mt-2">

              {job.company}

            </p>

            <p className="mt-4">

              {job.description}
            </p>

            <div className="mt-5 flex justify-between items-center">

              <span className="text-green-600 font-bold">

                ₹{job.salary}

              </span>

              <a
                href={`/apply-job/${job._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Apply
              </a>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}