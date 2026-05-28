import {
  useEffect,
  useState,
} from "react";

import {
  Download,
  IndianRupee,
  Calendar,
} from "lucide-react";

import API from "../services/api";

export default function MyPayslip() {

  const [payslips, setPayslips] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ================= FETCH =================

  useEffect(() => {

    fetchPayslips();

  }, []);

  const fetchPayslips =
    async () => {

      try {

        const res =
          await API.get(
            `/payroll/my/${user.id}`
          );

        setPayslips(res.data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= DOWNLOAD =================

  const downloadPayslip =
    async (id) => {

      try {

        const res =
          await API.get(
            `/payroll/payslip/${id}`,
            {
              responseType: "blob",
            }
          );

        const url =
          window.URL.createObjectURL(
            new Blob([res.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          `Payslip-${id}.pdf`;

        link.click();

      } catch (err) {

        console.log(err);

        alert(
          "Failed to download payslip"
        );

      }

    };

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-sky-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <h1 className="text-4xl font-black">
          My Payslips
        </h1>

        <p className="mt-2 text-cyan-100">
          View and download salary slips
        </p>

      </div>

      {/* LIST */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {

          loading ? (

            <div className="text-center p-20">

              <h2 className="text-2xl font-bold">
                Loading Payslips...
              </h2>

            </div>

          ) : payslips.length === 0 ? (

            <div className="text-center p-20">

              <h2 className="text-3xl font-black">
                No Payslips Found
              </h2>

            </div>

          ) : (

            payslips.map((item) => (

              <div
                key={item._id}
                className="
                  bg-white
                  rounded-3xl
                  shadow-xl
                  p-8
                  border
                  border-slate-100
                "
              >

                {/* TOP */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-8
                  "
                >

                  <div>

                    <h2 className="text-2xl font-black">
                      Payslip
                    </h2>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-gray-500
                        mt-2
                      "
                    >

                      <Calendar size={18} />

                      {item.month}

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      downloadPayslip(
                        item._id
                      )
                    }
                    className="
                      bg-gradient-to-r
                      from-blue-600
                      to-cyan-500
                      text-white
                      p-4
                      rounded-2xl
                      hover:scale-105
                      transition-all
                    "
                  >

                    <Download />

                  </button>

                </div>

                {/* DETAILS */}

                <div className="space-y-4">

                  <SalaryRow
                    label="Basic Salary"
                    value={item.basicSalary}
                  />

                  <SalaryRow
                    label="Bonus"
                    value={item.bonus}
                    green
                  />

                  <SalaryRow
                    label="Deduction"
                    value={item.deduction}
                    red
                  />

                  <div className="border-t pt-5">

                    <SalaryRow
                      label="Net Salary"
                      value={item.netSalary}
                      blue
                      big
                    />

                  </div>

                </div>

              </div>

            ))

          )

        }

      </div>

    </div>

  );

}

// ================= COMPONENT =================

function SalaryRow({
  label,
  value,
  green,
  red,
  blue,
  big,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <p className="text-gray-500">
        {label}
      </p>

      <h3
        className={`
          font-black
          flex
          items-center
          gap-1
          ${big ? "text-3xl" : "text-xl"}
          ${green && "text-green-600"}
          ${red && "text-red-600"}
          ${blue && "text-blue-600"}
        `}
      >

        <IndianRupee size={18} />

        {value || 0}

      </h3>

    </div>

  );

}