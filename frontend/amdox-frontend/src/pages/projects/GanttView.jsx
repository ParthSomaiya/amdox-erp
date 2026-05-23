import {
  Gantt,
  ViewMode,
} from "gantt-task-react";

import "gantt-task-react/dist/index.css";

export default function GanttView() {

  const tasks = [

    {
      start:
        new Date(2026, 4, 1),

      end:
        new Date(2026, 4, 5),

      name:
        "UI Design",

      id: "1",

      type: "task",

      progress: 45,

      isDisabled: false,
    },

    {
      start:
        new Date(2026, 4, 6),

      end:
        new Date(2026, 4, 10),

      name:
        "Backend API",

      id: "2",

      type: "task",

      progress: 20,

      isDisabled: false,
    },

  ];

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Project Gantt Chart
      </h2>

      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
      />

    </div>

  );

}