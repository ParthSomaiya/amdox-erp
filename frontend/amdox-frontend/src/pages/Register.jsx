import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  return (

    <div className="flex flex-col items-center mt-20 gap-6">

      <h2 className="text-2xl font-bold">
        Join Amdox
      </h2>

      <button
        onClick={() =>
          navigate("/register/employee")
        }
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Join as Employee
      </button>

      <button
        onClick={() =>
          navigate("/register/job")
        }
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Find a Job
      </button>

    </div>

  );

}