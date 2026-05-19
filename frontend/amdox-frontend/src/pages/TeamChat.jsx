import {

  useEffect,
  useState,

} from "react";

import {
  io,
} from "socket.io-client";

import api
from "../utils/axiosInstance";

const socket =
  io("http://localhost:5000");

export default function TeamChat() {

  const [messages,
    setMessages] =
    useState([]);

  const [text,
    setText] =
    useState("");

  const room =
    "general";

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // FETCH OLD
  const fetchMessages =
    async () => {

      try {

        const res =
          await api.get(
            `/chat/${room}`
          );

        setMessages(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

  };

  useEffect(() => {

    fetchMessages();

    socket.emit(
      "joinRoom",
      room
    );

    socket.on(

      "receiveMessage",

      (msg) => {

        setMessages(
          (prev) => [

            ...prev,
            msg,

          ]
        );

      }

    );

    return () => {

      socket.off(
        "receiveMessage"
      );

    };

  }, []);

  // SEND
  const sendMessage =
    async () => {

      if (!text) return;

      const msg = {

        room,

        text,

        sender: {

          name:
            user.name,

        },

      };

      socket.emit(
        "sendMessage",
        msg
      );

      setText("");

  };

  return (

    <div className="p-6">

      <h1
        className="
          text-2xl
          font-bold
          mb-4
        "
      >

        💬 Team Chat

      </h1>

      {/* CHAT BOX */}
      <div
        className="
          bg-white
          rounded-lg
          shadow
          h-[500px]
          overflow-y-auto
          p-4
          mb-4
        "
      >

        {messages.map((m, i) => (

          <div
            key={i}
            className="mb-3"
          >

            <p className="font-bold">

              {m.sender?.name}

            </p>

            <p
              className="
                bg-gray-100
                p-2
                rounded
                inline-block
              "
            >

              {m.text}

            </p>

          </div>

        ))}

      </div>

      {/* INPUT */}
      <div className="flex gap-2">

        <input

          value={text}

          onChange={(e) =>
            setText(
              e.target.value
            )
          }

          className="
            border
            p-2
            flex-1
          "

          placeholder="Type message..."

        />

        <button

          onClick={sendMessage}

          className="
            bg-blue-500
            text-white
            px-4
            rounded
          "

        >

          Send

        </button>

      </div>

    </div>

  );

}