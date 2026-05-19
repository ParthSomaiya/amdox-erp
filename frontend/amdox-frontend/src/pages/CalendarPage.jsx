import {

  useEffect,
  useState,

} from "react";

import moment from "moment";

import {

  Calendar,
  momentLocalizer,

} from "react-big-calendar";

import
"react-big-calendar/lib/css/react-big-calendar.css";

import api
from "../utils/axiosInstance";

const localizer =
  momentLocalizer(moment);

export default function CalendarPage() {

  const [events,
    setEvents] =
    useState([]);

  useEffect(() => {

    fetchCalendar();

  }, []);

  const fetchCalendar =
    async () => {

      try {

        // LEAVES
        const leaveRes =
          await api.get(
            "/leave"
          );

        // TASKS
        const taskRes =
          await api.get(
            "/tasks"
          );

        // LEAVE EVENTS
        const leaveEvents =
          leaveRes.data.map((l) => ({

            title:
              `Leave - ${l.employeeName}`,

            start:
              new Date(l.startDate),

            end:
              new Date(l.endDate),

          }));

        // TASK EVENTS
        const taskEvents =
          taskRes.data.map((t) => ({

            title:
              `Task - ${t.title}`,

            start:
              new Date(t.startDate),

            end:
              new Date(t.endDate),

          }));

        setEvents([

          ...leaveEvents,
          ...taskEvents,

        ]);

      } catch (err) {

        console.log(err);

      }

  };

  return (

    <div className="p-6">

      <h1
        className="
          text-2xl
          font-bold
          mb-5
        "
      >

        📅 ERP Calendar

      </h1>

      <div
        className="
          bg-white
          p-4
          rounded-lg
          shadow
          h-[700px]
        "
      >

        <Calendar

          localizer={localizer}

          events={events}

          startAccessor="start"

          endAccessor="end"

          style={{
            height: "100%",
          }}

        />

      </div>

    </div>

  );

}