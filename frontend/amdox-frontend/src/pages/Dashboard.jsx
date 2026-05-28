export default function Dashboard() {

  // ================= USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  // ================= STATS =================

  const stats = [

    {
      title: "Employees",
      value: "120",
      color: "from-cyan-500 to-blue-600",
      icon: "👥",
    },

    {
      title: "Projects",
      value: "18",
      color: "from-purple-500 to-indigo-600",
      icon: "🚀",
    },

    {
      title: "Attendance",
      value: "95%",
      color: "from-green-500 to-emerald-600",
      icon: "📅",
    },

    {
      title: "Revenue",
      value: "₹8.4L",
      color: "from-orange-500 to-red-500",
      icon: "💰",
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
          from-cyan-500
          via-blue-600
          to-indigo-700
          p-10
          text-white
          shadow-2xl
        "
      >

        {/* GLOW */}

        <div
          className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-white/10
            rounded-full
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

            Role :
            {" "}
            {user?.role}

          </p>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {
          stats.map((item, index) => (

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

              {/* TOP */}

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

          <div className="flex items-center justify-between">

            <h2
              className="
                text-2xl
                font-black
              "
            >

              Recent Activity

            </h2>

          </div>

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

                  New Employee Joined

                </h3>

                <p className="text-gray-500 text-sm">

                  John Doe added into HR Department

                </p>

              </div>

              <span className="text-sm text-gray-400">

                2 min ago

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

                  Payroll Generated

                </h3>

                <p className="text-gray-500 text-sm">

                  April Payroll completed successfully

                </p>

              </div>

              <span className="text-sm text-gray-400">

                1 hour ago

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

                  New Project Created

                </h3>

                <p className="text-gray-500 text-sm">

                  ERP AI Automation Project added

                </p>

              </div>

              <span className="text-sm text-gray-400">

                Yesterday

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
                bg-blue-100
                text-blue-700
                font-semibold
              "
            >

              {user?.role}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}