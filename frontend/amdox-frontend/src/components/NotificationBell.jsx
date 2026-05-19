import {

  useEffect,
  useState,

} from "react";

import { io }
from "socket.io-client";

import api
from "../utils/axiosInstance";

import {
  FaBell,
} from "react-icons/fa";

const socket =
  io("http://localhost:5000");

export default function NotificationBell() {

  const [notifications,
    setNotifications] =
    useState([]);

  const [open,
    setOpen] =
    useState(false);

  // USER
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // FETCH
  const fetchNotifications =
    async () => {

      try {

        const res =
          await api.get(
            "/notifications"
          );

        setNotifications(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

  };

  useEffect(() => {

    fetchNotifications();

    // JOIN ROOM
    if (user?._id) {

      socket.emit(
        "join",
        user._id
      );

    }

    // REALTIME LISTENER
    socket.on(
      "notification",

      (data) => {

        setNotifications(
          (prev) => [

            data,
            ...prev,

          ]
        );

      }

    );

    return () => {

      socket.off(
        "notification"
      );

    };

  }, []);

  // MARK READ
  const markRead =
    async (id) => {

      try {

        await api.put(
          `/notifications/${id}/read`
        );

        setNotifications(

          notifications.map((n) =>

            n._id === id
              ? {
                  ...n,
                  isRead: true,
                }
              : n

          )

        );

      } catch (err) {

        console.log(err);

      }

  };

  // UNREAD COUNT
  const unread =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  return (

    <div className="relative">

      {/* BELL */}
      <button

        onClick={() =>
          setOpen(!open)
        }

        className="relative text-xl"

      >

        <FaBell />

        {unread > 0 && (

          <span
            className="
              absolute
              -top-2
              -right-2
              bg-red-500
              text-white
              rounded-full
              text-xs
              px-1
            "
          >

            {unread}

          </span>

        )}

      </button>

      {/* DROPDOWN */}
      {open && (

        <div
          className="
            absolute
            right-0
            mt-2
            w-80
            bg-white
            shadow-lg
            rounded-lg
            z-50
            max-h-96
            overflow-y-auto
          "
        >

          <div className="p-3 border-b font-bold">

            Notifications

          </div>

          {notifications.length === 0 ? (

            <p className="p-4 text-gray-500">

              No notifications

            </p>

          ) : (

            notifications.map((n) => (

              <div

                key={n._id}

                onClick={() =>
                  markRead(n._id)
                }

                className={`
                  p-3
                  border-b
                  cursor-pointer
                  hover:bg-gray-100

                  ${
                    !n.isRead
                      ? "bg-blue-50"
                      : ""
                  }
                `}

              >

                <p className="font-semibold">

                  {n.title}

                </p>

                <p className="text-sm text-gray-600">

                  {n.message}

                </p>

              </div>

            ))

          )}

        </div>

      )}

    </div>

  );

}