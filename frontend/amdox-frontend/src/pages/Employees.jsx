import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Users,
  Mail,
  Briefcase,
  Plus,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import API from "../services/api";

export default function Employees() {

  // ================= STATE =================

  const [employees, setEmployees] =
    useState([]);

  const [filteredEmployees, setFilteredEmployees] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH =================

  useEffect(() => {

    fetchEmployees();

  }, []);

  const fetchEmployees =
    async () => {

      try {

        const res =
          await API.get("/hr");

        setEmployees(res.data);

        setFilteredEmployees(
          res.data
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= SEARCH =================

  useEffect(() => {

    const filtered =
      employees.filter((emp) => {

        const name =
          emp?.userId?.name
            ?.toLowerCase() || "";

        const email =
          emp?.userId?.email
            ?.toLowerCase() || "";

        const position =
          emp?.position
            ?.toLowerCase() || "";

        return (

          name.includes(
            search.toLowerCase()
          ) ||

          email.includes(
            search.toLowerCase()
          ) ||

          position.includes(
            search.toLowerCase()
          )

        );

      });

    setFilteredEmployees(filtered);

  }, [search, employees]);

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
          shadow-xl
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
              "
            >

              Employees

            </h1>

            <p
              className="
                mt-4
                text-cyan-100
                text-lg
              "
            >

              Manage all company employees professionally

            </p>

          </div>

          <Link
            to="/add-employee"
            className="
              h-14
              px-8
              rounded-2xl
              bg-white
              text-blue-700
              font-bold
              flex
              items-center
              justify-center
              gap-3
              hover:scale-105
              transition-all
              duration-300
            "
          >

            <Plus size={22} />

            Add Employee

          </Link>

        </div>

      </div>

      {/* SEARCH */}

      <div
        className="
          bg-white
          rounded-[28px]
          shadow-lg
          p-6
        "
      >

        <div
          className="
            h-16
            border
            border-gray-200
            rounded-2xl
            flex
            items-center
            px-5
            focus-within:border-cyan-500
          "
        >

          <Search
            size={22}
            className="
              text-gray-400
            "
          />

          <input

            type="text"

            placeholder="Search employee by name, email or position..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="
              flex-1
              h-full
              px-4
              outline-none
              text-lg
            "
          />

        </div>

      </div>

      {/* TABLE */}

      <div
        className="
          bg-white
          rounded-[32px]
          shadow-lg
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-12
            bg-slate-100
            px-8
            py-5
            font-bold
            text-gray-600
            text-sm
            uppercase
            tracking-wider
          "
        >

          <div className="col-span-4">
            Employee
          </div>

          <div className="col-span-3">
            Email
          </div>

          <div className="col-span-3">
            Position
          </div>

          <div className="col-span-2">
            Status
          </div>

        </div>

        {/* BODY */}

        {

          loading ? (

            <div className="p-20 text-center">

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >

                Loading Employees...

              </h2>

            </div>

          ) : filteredEmployees.length === 0 ? (

            <div className="p-20 text-center">

              <Users
                size={70}
                className="
                  mx-auto
                  text-gray-300
                "
              />

              <h2
                className="
                  text-3xl
                  font-black
                  mt-6
                "
              >

                No Employees Found

              </h2>

            </div>

          ) : (

            filteredEmployees.map((emp) => (

              <div

                key={emp._id}

                className="
                  grid
                  grid-cols-12
                  px-8
                  py-6
                  border-b
                  hover:bg-slate-50
                  transition-all
                "
              >

                {/* EMPLOYEE */}

                <div
                  className="
                    col-span-4
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      h-14
                      w-14
                      rounded-2xl
                      bg-gradient-to-r
                      from-cyan-500
                      to-blue-600
                      flex
                      items-center
                      justify-center
                      text-white
                      font-black
                      text-xl
                    "
                  >

                    {

                      emp?.userId?.name
                        ?.charAt(0)
                        ?.toUpperCase()

                    }

                  </div>

                  <div>

                    <h2
                      className="
                        font-bold
                        text-lg
                      "
                    >

                      {
                        emp?.userId?.name
                      }

                    </h2>

                    <p className="text-gray-500 text-sm">

                      Employee ID:
                      {" "}
                      {emp._id.slice(-6)}

                    </p>

                  </div>

                </div>

                {/* EMAIL */}

                <div
                  className="
                    col-span-3
                    flex
                    items-center
                    gap-3
                    text-gray-600
                  "
                >

                  <Mail size={18} />

                  {
                    emp?.userId?.email
                  }

                </div>

                {/* POSITION */}

                <div
                  className="
                    col-span-3
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Briefcase
                    size={18}
                    className="
                      text-cyan-600
                    "
                  />

                  <span className="font-semibold">

                    {emp?.position}

                  </span>

                </div>

                {/* STATUS */}

                <div
                  className="
                    col-span-2
                    flex
                    items-center
                  "
                >

                  <span
                    className="
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-bold
                      bg-green-100
                      text-green-700
                    "
                  >

                    Active

                  </span>

                </div>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}