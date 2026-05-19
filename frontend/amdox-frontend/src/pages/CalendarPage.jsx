import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";


export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/calendar");

      setEvents(
        res.data.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.start,
          end: event.end,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDateClick = async (info) => {
    const title = prompt("Event Title:");

    if (!title) return;

    try {
      await api.post("/calendar", {
        title,
        start: info.dateStr,
        end: info.dateStr,
      });

      fetchEvents();
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
            <h2 className="font-bold">
              {event.title}
            </h2>

            <p>
              Start:
              {" "}
              {new Date(event.start).toLocaleDateString()}
            </p>

            <p>
              End:
              {" "}
              {new Date(event.end).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}