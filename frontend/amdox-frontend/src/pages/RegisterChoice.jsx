export default function RegisterChoice() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Register As
        </h1>

        <div className="space-y-4">

          <a
            href="/register/employee"
            className="block bg-blue-600 text-white text-center py-3 rounded"
          >
            Employee
          </a>

          <a
            href="/register/job"
            className="block bg-green-600 text-white text-center py-3 rounded"
          >
            Job Applicant
          </a>

        </div>

      </div>

    </div>

  );

}