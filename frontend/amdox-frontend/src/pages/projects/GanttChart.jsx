import {
  Gantt,
  ViewMode,
} from "gantt-task-react";

import "gantt-task-react/dist/index.css";

export default function GanttChart({

  tasks,

}) {

  return (

    <div className="bg-white rounded-xl shadow p-5">

      <Gantt

        tasks={tasks}

        viewMode={ViewMode.Day}

      />

    </div>

  );

}