import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-6
      "
    >

      <div
        className="
          glass
          p-10
          rounded-[32px]
          w-full
          max-w-xl
        "
      >

        <h1
          className="
            text-5xl
            font-black
            gradient-text
            mb-3
          "
        >
          Join AMDOX
        </h1>

        <p className="text-slate-400 mb-10">

          Choose your platform access

        </p>

        <div className="grid md:grid-cols-2 gap-6">

          <button
            onClick={() =>
              navigate(
                "/register/employee"
              )
            }
            className="
              premium-card
              p-8
              text-left
            "
          >

            <div className="text-5xl mb-5">
              👨‍💼
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Employee Portal
            </h2>

            <p className="text-slate-400">
              HR, payroll, attendance,
              dashboard and company tools.
            </p>

          </button>

          <button
            onClick={() =>
              navigate("/register/job")
            }
            className="
              premium-card
              p-8
              text-left
            "
          >

            <div className="text-5xl mb-5">
              💼
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Career Portal
            </h2>

            <p className="text-slate-400">
              Apply jobs, track applications
              and career opportunities.
            </p>

          </button>

        </div>

      </div>

    </div>

  );

}