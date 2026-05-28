export default function EmployeeDashboard() {

  // ================= USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  // ================= CARDS =================

  const cards = [

    {
      title: "Attendance",
      value: "96%",
      icon: "📅",
      color: "from-cyan-500 to-blue-600",
    },

    {
      title: "Leaves Left",
      value: "08",
      icon: "📩",
      color: "from-green-500 to-emerald-600",
    },

    {
      title: "Salary Status",
      value: "PAID",
      icon: "💵",
      color: "from-orange-500 to-red-500",
    },

  ];

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-indigo-600
          p-10
          text-white
          shadow-2xl
        "
      >

        {/* GLOW */}

        <div
          className="
            absolute
            right-0
            top-0
            w-72
            h-72
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div className="relative z-10">

          <p className="text-cyan-100 text-lg">

            Welcome Back

          </p>

          <h1
            className="
              text-5xl
              font-black
              mt-3
            "
          >

            {user?.name}

          </h1>

          <p
            className="
              mt-4
              text-cyan-100
              text-lg
            "
          >

            Employee Portal

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

        {
          cards.map((item, index) => (

            <div

              key={index}

              className="
                bg-white
                rounded-[28px]
                p-6
                shadow-lg
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">

                    {item.title}

                  </p>

                  <h2
                    className="
                      text-4xl
                      font-black
                      mt-3
                    "
                  >

                    {item.value}

                  </h2>

                </div>

                <div
                  className={`
                    h-16
                    w-16
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-3xl
                    bg-gradient-to-r
                    ${item.color}
                    text-white
                    shadow-lg
                  `}
                >

                  {item.icon}

                </div>

              </div>

            </div>

          ))
        }

      </div>

      {/* CONTENT */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
        "
      >

        {/* RECENT ACTIVITY */}

        <div
          className="
            lg:col-span-2
            bg-white
            rounded-[28px]
            p-8
            shadow-lg
          "
        >

          <h2
            className="
              text-2xl
              font-black
            "
          >

            Recent Activity

          </h2>

          <div className="mt-8 space-y-5">

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                pb-4
              "
            >

              <div>

                <h3 className="font-semibold">

                  Attendance Marked

                </h3>

                <p className="text-gray-500 text-sm">

                  Today check-in completed

                </p>

              </div>

              <span className="text-sm text-gray-400">

                09:10 AM

              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                pb-4
              "
            >

              <div>

                <h3 className="font-semibold">

                  Leave Request Submitted

                </h3>

                <p className="text-gray-500 text-sm">

                  Waiting for HR approval

                </p>

              </div>

              <span className="text-sm text-gray-400">

                Yesterday

              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3 className="font-semibold">

                  Payslip Generated

                </h3>

                <p className="text-gray-500 text-sm">

                  April salary credited

                </p>

              </div>

              <span className="text-sm text-gray-400">

                2 days ago

              </span>

            </div>

          </div>

        </div>

        {/* PROFILE */}

        <div
          className="
            bg-white
            rounded-[28px]
            p-8
            shadow-lg
          "
        >

          <div className="text-center">

            {/* AVATAR */}

            <div
              className="
                h-24
                w-24
                mx-auto
                rounded-[28px]
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                flex
                items-center
                justify-center
                text-white
                text-4xl
                font-black
              "
            >

              {
                user?.name
                  ?.charAt(0)
                  ?.toUpperCase()
              }

            </div>

            <h2
              className="
                text-2xl
                font-black
                mt-5
              "
            >

              {user?.name}

            </h2>

            <p className="text-gray-500 mt-2">

              {user?.email}

            </p>

            <div
              className="
                mt-6
                inline-flex
                px-5
                py-2
                rounded-2xl
                bg-cyan-100
                text-cyan-700
                font-semibold
              "
            >

              EMPLOYEE

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}