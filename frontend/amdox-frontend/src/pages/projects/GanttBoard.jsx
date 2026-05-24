import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import GanttChart from "./GanttChart";

export default function GanttBoard() {

  const [tasks,
    setTasks] =
    useState([]);

  // ================= LOAD TASKS =================

  useEffect(() => {

    loadTasks();

  }, []);

  const loadTasks =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/projects/gantt"

          );

        setTasks(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          📅 Project Gantt Board

        </h1>

        <p className="text-gray-500 mt-2">

          Realtime project timeline & dependencies

        </p>

      </div>

      {/* GANTT */}

      <GanttChart
        tasks={tasks}
      />

    </div>

  );

}