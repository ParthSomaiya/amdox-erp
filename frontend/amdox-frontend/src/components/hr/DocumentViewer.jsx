import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import {
  useState,
} from "react";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentViewer({
  file,
}) {

  const [pages, setPages] =
    useState(null);

  return (

    <div className="bg-white p-4 rounded shadow">

      <Document

        file={file}

        onLoadSuccess={({
          numPages,
        }) =>
          setPages(numPages)
        }

      >

        {Array.from(
          new Array(pages),
          (el, index) => (

            <Page
              key={index}
              pageNumber={
                index + 1
              }
            />

          )
        )}

      </Document>

    </div>

  );

}