import { useState } from "react";

import { QrReader } from "react-qr-reader";

export default function BarcodeScanner() {

  const [data, setData] =
    useState("");

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Barcode Scanner
      </h2>

      <div className="bg-white p-5 rounded shadow">

        <QrReader
          onResult={(result) => {

            if (result) {

              setData(
                result?.text
              );

            }

          }}
          style={{
            width: "100%",
          }}
        />

        <div className="mt-4">

          <p className="font-semibold">
            Scanned Result:
          </p>

          <p className="text-blue-600">
            {data}
          </p>

        </div>

      </div>

    </div>

  );

}