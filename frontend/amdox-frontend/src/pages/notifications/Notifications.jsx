import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Notifications() {

  const [data, setData] =
    useState([]);

  const audio =
    new Audio(
      "/notification.mp3"
    );

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications =
    async () => {

      const res =
        await API.get(
          "/notifications"
        );

      setData(res.data);

      audio.play();

    };

  const markAll =
    async () => {

      await API.put(
        "/notifications/read-all"
      );

      fetchNotifications();

    };

  const markRead =
    async (id) => {

      await API.put(
        `/notifications/read/${id}`
      );

      fetchNotifications();

    };

  return (

    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h2 className="text-3xl font-bold">
          Notifications
        </h2>

        <button
          onClick={markAll}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Mark All Read
        </button>

      </div>

      <div className="space-y-4">

        {data.map((n) => (

          <div
            key={n._id}

            className={`p-5 rounded shadow flex justify-between items-center ${
              n.isRead
                ? "bg-gray-100"
                : "bg-blue-50"
            }`}
          >

            <div>

              <h3 className="font-bold">
                {n.title}
              </h3>

              <p>
                {n.message}
              </p>

              <span className="text-sm text-gray-500">
                {n.type}
              </span>

            </div>

            {!n.isRead && (

              <button
                onClick={() =>
                  markRead(n._id)
                }

                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Read
              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}