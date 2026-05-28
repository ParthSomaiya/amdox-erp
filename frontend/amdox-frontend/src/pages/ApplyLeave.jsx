import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  FileText,
  Send,
  ShieldCheck,
} from "lucide-react";

import API from "../services/api";

export default function ApplyLeave() {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  const [loading, setLoading] =
    useState(false);

  const [myLeaves, setMyLeaves] =
    useState([]);

  const [form, setForm] =
    useState({

      leaveType: "CASUAL",

      fromDate: "",

      toDate: "",

      reason: "",

    });

  const leaveBalance =
    useMemo(() => {

      return {

        casual: 8,

        sick: 5,

        paid: 12,

      };

    }, []);

  useEffect(() => {

    fetchMyLeaves();

  }, []);

  const fetchMyLeaves =
    async () => {

      try {

        const res =
          await API.get(
            "/leave/my"
          );

        setMyLeaves(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  const validateDates = () => {

    if (
      !form.fromDate ||
      !form.toDate
    ) {

      return false;

    }

    const from =
      new Date(form.fromDate);

    const to =
      new Date(form.toDate);

    return from <= to;

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!validateDates()) {

        alert(
          "From Date cannot be greater than To Date"
        );

        return;

      }

      try {

        setLoading(true);

        await API.post(
          "/leave/apply",
          form
        );

        alert(
          "Leave Applied Successfully"
        );

        setForm({

          leaveType: "CASUAL",

          fromDate: "",

          toDate: "",

          reason: "",

        });

        fetchMyLeaves();

      } catch (err) {

        console.log(err);

        alert(

          err.response?.data
            ?.message ||

          "Failed to apply leave"

        );

      } finally {

        setLoading(false);

      }

    };

  const badgeColor = (status) => {

    switch (status) {

      case "APPROVED":

        return `
          bg-green-100
          text-green-700
        `;

      case "REJECTED":

        return `
          bg-red-100
          text-red-700
        `;

      default:

        return `
          bg-yellow-100
          text-yellow-700
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
          from-orange-500
          via-red-500
          to-pink-600
          p-8
          text-white
          shadow-2xl
        "
      >

        <div
          className="
            absolute
            right-0
            top-0
            h-48
            w-48
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div className="relative z-10">

          <div
            className="
              flex
              items-center
              gap-3
              mb-4
            "
          >

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-white/20
                flex
                items-center
                justify-center
              "
            >
              <CalendarDays size={28} />
            </div>

            <div>

              <h1 className="text-4xl font-black">

                Leave Management

              </h1>

              <p className="text-orange-100 mt-1">

                Apply and track your leave requests

              </p>

            </div>

          </div>

          <div
            className="
              flex
              flex-wrap
              gap-4
              mt-6
            "
          >

            <div
              className="
                bg-white/15
                rounded-2xl
                px-5
                py-4
                min-w-[150px]
              "
            >

              <p className="text-sm text-orange-100">

                Casual Leave

              </p>

              <h3 className="text-3xl font-black">

                {leaveBalance.casual}

              </h3>

            </div>

            <div
              className="
                bg-white/15
                rounded-2xl
                px-5
                py-4
                min-w-[150px]
              "
            >

              <p className="text-sm text-orange-100">

                Sick Leave

              </p>

              <h3 className="text-3xl font-black">

                {leaveBalance.sick}

              </h3>

            </div>

            <div
              className="
                bg-white/15
                rounded-2xl
                px-5
                py-4
                min-w-[150px]
              "
            >

              <p className="text-sm text-orange-100">

                Paid Leave

              </p>

              <h3 className="text-3xl font-black">

                {leaveBalance.paid}

              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-8
        "
      >

        {/* APPLY FORM */}

        <div
          className="
            xl:col-span-2
            bg-white
            rounded-[30px]
            shadow-lg
            border
            border-gray-100
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-8
            "
          >

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <FileText size={24} />
            </div>

            <div>

              <h2 className="text-2xl font-black text-slate-800">

                Apply New Leave

              </h2>

              <p className="text-slate-500">

                Fill the details below

              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* TYPE */}

            <div>

              <label
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                  block
                  mb-2
                "
              >
                Leave Type
              </label>

              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  px-4
                  py-4
                  outline-none
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              >

                <option value="CASUAL">
                  Casual Leave
                </option>

                <option value="SICK">
                  Sick Leave
                </option>

                <option value="PAID">
                  Paid Leave
                </option>

                <option value="EMERGENCY">
                  Emergency Leave
                </option>

              </select>

            </div>

            {/* DATES */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              <div>

                <label
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                    block
                    mb-2
                  "
                >
                  From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    px-4
                    py-4
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

              <div>

                <label
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                    block
                    mb-2
                  "
                >
                  To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    px-4
                    py-4
                    outline-none
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

            </div>

            {/* REASON */}

            <div>

              <label
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                  block
                  mb-2
                "
              >
                Reason
              </label>

              <textarea
                rows="6"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter detailed reason..."
                required
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  px-4
                  py-4
                  outline-none
                  resize-none
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                py-4
                text-lg
                font-bold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.01]
                disabled:opacity-50
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <Send size={20} />

              {
                loading
                  ? "Submitting..."
                  : "Apply Leave"
              }

            </button>

          </form>

        </div>

        {/* HISTORY */}

        <div
          className="
            bg-white
            rounded-[30px]
            shadow-lg
            border
            border-gray-100
            p-6
            h-fit
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-green-100
                text-green-600
                flex
                items-center
                justify-center
              "
            >
              <Clock3 size={24} />
            </div>

            <div>

              <h2 className="text-2xl font-black text-slate-800">

                My Leaves

              </h2>

              <p className="text-slate-500">

                Recent leave requests

              </p>

            </div>

          </div>

          <div className="space-y-4">

            {
              myLeaves.length === 0 && (

                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    p-6
                    text-center
                  "
                >

                  <ShieldCheck
                    size={42}
                    className="
                      mx-auto
                      text-slate-400
                      mb-3
                    "
                  />

                  <p className="text-slate-500">

                    No leave requests found

                  </p>

                </div>

              )
            }

            {
              myLeaves.map((leave) => (

                <div
                  key={leave._id}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <h3
                      className="
                        font-bold
                        text-slate-800
                      "
                    >
                      {
                        leave.leaveType
                      }
                    </h3>

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold
                        ${badgeColor(
                          leave.status
                        )}
                      `}
                    >

                      {
                        leave.status
                      }

                    </span>

                  </div>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-2
                    "
                  >

                    {
                      leave.fromDate?.slice(0, 10)
                    }

                    {" "}to{" "}

                    {
                      leave.toDate?.slice(0, 10)
                    }

                  </p>

                  <p
                    className="
                      text-sm
                      text-slate-600
                      mt-3
                    "
                  >
                    {leave.reason}
                  </p>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </div>

  );

}