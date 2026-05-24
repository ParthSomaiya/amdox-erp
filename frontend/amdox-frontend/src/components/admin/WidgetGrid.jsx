import GridLayout from "react-grid-layout";

import "react-grid-layout/css/styles.css";

import "react-resizable/css/styles.css";

export default function WidgetGrid({
  widgets,
}) {

  const layout = [

    {
      i: "revenue",
      x: 0,
      y: 0,
      w: 4,
      h: 2,
    },

    {
      i: "employees",
      x: 4,
      y: 0,
      w: 4,
      h: 2,
    },

  ];

  return (

    <GridLayout

      className="layout"

      layout={layout}

      cols={12}

      rowHeight={100}

      width={1200}

    >

      <div
        key="revenue"
        className="bg-white rounded shadow p-4"
      >

        Revenue Widget

      </div>

      <div
        key="employees"
        className="bg-white rounded shadow p-4"
      >

        Employee Widget

      </div>

    </GridLayout>

  );

}