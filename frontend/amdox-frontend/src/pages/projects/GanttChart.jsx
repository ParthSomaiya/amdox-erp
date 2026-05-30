import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

export default function GanttChart({ tasks }) {
  return (
    <div className="w-full">
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
        listCellWidth="160px"
        columnWidth={65}
        rowHeight={52}
        headerHeight={52}
        barCornerRadius={8}
        todayColor="rgba(79, 70, 229, 0.04)"
      />
    </div>
  );
}