import {
  useState,
} from "react";

import axios from "axios";

export default function InterviewScheduler() {

  const [form, setForm] =
    useState({

      candidateName: "",

      candidateEmail: "",

      company: "",

      date: "",

      time: "",

      meetingLink: "",

    });

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(

          "http://localhost:5000/api/jobs/interview",

          form

        );

        alert(
          "Interview Scheduled"
        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-6">

          Interview Scheduler

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="candidateName"
            placeholder="Candidate Name"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            name="candidateEmail"
            placeholder="Candidate Email"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="time"
            name="time"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="meetingLink"
            placeholder="Meeting Link"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >

            Schedule Interview

          </button>

        </form>

      </div>

    </div>

  );

}