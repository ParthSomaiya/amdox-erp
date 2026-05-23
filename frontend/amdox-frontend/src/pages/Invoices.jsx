import { useEffect, useState } from "react";
import API from "../services/api";

export default function Invoices() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchInvoices();

  }, []);

  const fetchInvoices = async () => {

    const res = await API.get(
      "/finance/invoice"
    );

    setData(res.data);

  };

  // ================= MARK PAID =================

  const markPaid = async (id) => {

    await API.post(
      "/finance/invoice/paid",
      {
        invoiceId: id,
      }
    );

    fetchInvoices();

  };

  const payOnline = async (amount) => {

    const res = await API.post(
      "/payment/create",
      {
        amount,
      }
    );

    window.location.href =
      res.data.url;

  };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Invoices
      </h2>

      <div className="grid gap-4">

        {data.map((invoice) => (

          <div
            key={invoice._id}
            className="bg-white shadow rounded p-5 border"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="font-bold text-lg">
                  {invoice.invoiceNumber}
                </p>

                <p className="text-gray-600">
                  {invoice.clientName}
                </p>

                <p className="text-green-700 font-semibold">
                  ₹{invoice.amount}
                </p>

                <p className="mt-1">
                  Status:
                  <span
                    className={`ml-2 font-semibold ${invoice.status === "PAID"
                      ? "text-green-600"
                      : "text-red-500"
                      }`}
                  >
                    {invoice.status}
                  </span>
                </p>

              </div>

              <div className="flex gap-3">

                {/* DOWNLOAD PDF */}

                <a
                  href={`http://localhost:5000/api/invoice/pdf/${invoice._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </a>

                <button
                  onClick={() =>
                    payOnline(invoice.amount)
                  }
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Pay Online
                </button>

                {/* MARK PAID */}

                {invoice.status !== "PAID" && (

                  <button
                    onClick={() =>
                      markPaid(invoice._id)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Mark Paid
                  </button>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}