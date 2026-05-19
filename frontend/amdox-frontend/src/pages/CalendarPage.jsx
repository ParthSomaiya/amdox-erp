import { useEffect, useState }
from "react";

import api
from "../utils/axiosInstance";

export default function CalendarPage() {

  const [events, setEvents] =
    useState([]);

  useEffect(() => {

    fetchEvents();

  }, []);

  const fetchEvents =
    async () => {

      try {

        const res =
          await api.get(
            "/tasks"
          );

        setEvents(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">

        📅 Calendar

      </h1>

      <div className="space-y-4">

        {events.map((event) => (

          <div
            key={event._id}
            className="bg-white p-4 rounded shadow"
          >

            <h2 className="font-bold text-lg">

              {event.title}

            </h2>

            <p className="text-gray-600">

              Start:
              {" "}
              {new Date(
                event.startDate
              ).toLocaleDateString()}

            </p>

            <p className="text-gray-600">

              End:
              {" "}
              {new Date(
                event.endDate
              ).toLocaleDateString()}

            </p>

            <p className="mt-2">

              Status:
              {" "}
              {event.status}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}