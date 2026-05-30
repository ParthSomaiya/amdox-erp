import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  io,
} from "socket.io-client";

import {
  Send,
  Users,
  MessageCircle,
  Clock3,
} from "lucide-react";

import api from "../utils/axiosInstance";
import notifier from "../utils/notifier";

const socket = io(
  "http://localhost:5000",
  {
    transports: ["websocket"],
  }
);

export default function TeamChat() {

  // ================= STATES =================

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [onlineUsers, setOnlineUsers] =
    useState(0);

  const messagesEndRef =
    useRef(null);

  // ================= USER =================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const room = "general";

  // ================= AUTO SCROLL =================

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  };

  useEffect(() => {

    scrollToBottom();

  }, [messages]);

  // ================= FETCH OLD MESSAGES =================

  const fetchMessages =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            `/chat/${room}`
          );

        setMessages(res.data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= SOCKET =================

  useEffect(() => {

    fetchMessages();

    socket.emit(
      "joinRoom",
      room
    );

    socket.on(
      "receiveMessage",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message,
        ]);

        notifier.chatMessageSent(room);

      }
    );

    socket.on(
      "roomUsers",
      (users) => {

        setOnlineUsers(
          users?.length || 0
        );

      }
    );

    return () => {

      socket.off(
        "receiveMessage"
      );

      socket.off(
        "roomUsers"
      );

    };

  }, []);

  // ================= SEND MESSAGE =================

  const sendMessage =
    async () => {

      if (!text.trim()) return;

      const messageData = {

        room,

        text,

        sender: {

          id: user?.id,

          name:
            user?.name ||
            "User",

        },

        createdAt:
          new Date(),

      };

      socket.emit(
        "sendMessage",
        messageData
      );

      setText("");

    };

  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();

    }

  };

  // ================= FORMAT TIME =================

  const formatTime = (time) => {

    return new Date(
      time
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  };

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-cyan-600
          via-blue-600
          to-indigo-700
          rounded-[32px]
          p-10
          text-white
          shadow-2xl
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
                tracking-tight
              "
            >

              Team Chat

            </h1>

            <p
              className="
                mt-4
                text-cyan-100
                text-lg
              "
            >

              Real-time team collaboration
              and communication workspace

            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border
                border-white/20
                rounded-3xl
                px-6
                py-4
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-white/20
                  flex
                  items-center
                  justify-center
                "
              >

                <Users size={24} />

              </div>

              <div>

                <p className="text-cyan-100">

                  Online Users

                </p>

                <h2
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {onlineUsers}

                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CHAT CONTAINER */}

      <div
        className="
          bg-white
          rounded-[32px]
          shadow-2xl
          overflow-hidden
          border
          border-slate-200
        "
      >

        {/* TOP BAR */}

        <div
          className="
            border-b
            border-slate-200
            px-8
            py-6
            flex
            items-center
            justify-between
            bg-slate-50
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                flex
                items-center
                justify-center
                text-white
              "
            >

              <MessageCircle
                size={30}
              />

            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-black
                "
              >

                General Workspace

              </h2>

              <p className="text-gray-500">

                Team collaboration room

              </p>

            </div>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-green-600
              font-semibold
            "
          >

            <div
              className="
                h-3
                w-3
                rounded-full
                bg-green-500
                animate-pulse
              "
            />

            Active

          </div>

        </div>

        {/* CHAT BODY */}

        <div
          className="
            h-[600px]
            overflow-y-auto
            bg-slate-50
            p-8
            space-y-6
          "
        >

          {loading ? (

            <div
              className="
                h-full
                flex
                items-center
                justify-center
              "
            >

              <div className="text-center">

                <div
                  className="
                    h-16
                    w-16
                    border-4
                    border-cyan-500
                    border-t-transparent
                    rounded-full
                    animate-spin
                    mx-auto
                  "
                />

                <h2
                  className="
                    text-2xl
                    font-black
                    mt-6
                  "
                >

                  Loading Messages...

                </h2>

              </div>

            </div>

          ) : messages.length === 0 ? (

            <div
              className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >

              <div
                className="
                  h-24
                  w-24
                  rounded-full
                  bg-cyan-100
                  flex
                  items-center
                  justify-center
                  text-cyan-600
                "
              >

                <MessageCircle
                  size={45}
                />

              </div>

              <h2
                className="
                  text-3xl
                  font-black
                  mt-8
                "
              >

                No Messages Yet

              </h2>

              <p
                className="
                  text-gray-500
                  mt-4
                  text-lg
                "
              >

                Start the conversation
                with your team

              </p>

            </div>

          ) : (

            messages.map(
              (message, index) => {

                const isMe =
                  message?.sender?.name ===
                  user?.name;

                return (

                  <div
                    key={index}
                    className={`
                      flex
                      ${
                        isMe
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    <div
                      className={`
                        max-w-[75%]
                        ${
                          isMe
                            ? "items-end"
                            : "items-start"
                        }
                        flex
                        flex-col
                      `}
                    >

                      {/* USER */}

                      <div
                        className={`
                          flex
                          items-center
                          gap-2
                          mb-2
                          px-2
                        `}
                      >

                        {!isMe && (

                          <div
                            className="
                              h-10
                              w-10
                              rounded-full
                              bg-gradient-to-r
                              from-cyan-500
                              to-blue-600
                              flex
                              items-center
                              justify-center
                              text-white
                              font-bold
                            "
                          >

                            {

                              message
                                ?.sender
                                ?.name?.[0] || "U"

                            }

                          </div>

                        )}

                        <span
                          className="
                            text-sm
                            font-bold
                            text-gray-700
                          "
                        >

                          {

                            isMe
                              ? "You"
                              : message
                                  ?.sender
                                  ?.name

                          }

                        </span>

                      </div>

                      {/* MESSAGE */}

                      <div
                        className={`
                          px-6
                          py-4
                          rounded-[28px]
                          shadow-md
                          ${
                            isMe
                              ? `
                                bg-gradient-to-r
                                from-cyan-500
                                to-blue-600
                                text-white
                                rounded-br-md
                              `
                              : `
                                bg-white
                                text-gray-800
                                rounded-bl-md
                              `
                          }
                        `}
                      >

                        <p
                          className="
                            text-[15px]
                            leading-7
                            break-words
                          "
                        >

                          {message.text}

                        </p>

                        <div
                          className={`
                            flex
                            items-center
                            gap-1
                            mt-3
                            text-xs
                            ${
                              isMe
                                ? "text-cyan-100"
                                : "text-gray-400"
                            }
                          `}
                        >

                          <Clock3
                            size={12}
                          />

                          {

                            formatTime(
                              message.createdAt
                            )

                          }

                        </div>

                      </div>

                    </div>

                  </div>

                );

              }
            )

          )}

          <div ref={messagesEndRef} />

        </div>

        {/* INPUT AREA */}

        <div
          className="
            border-t
            border-slate-200
            bg-white
            p-6
          "
        >

          <div
            className="
              flex
              items-end
              gap-4
            "
          >

            <div className="flex-1">

              <textarea

                value={text}

                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }

                onKeyDown={handleKeyDown}

                rows={2}

                placeholder="Type your message..."

                className="
                  w-full
                  resize-none
                  rounded-3xl
                  border
                  border-slate-300
                  px-6
                  py-4
                  outline-none
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-100
                  text-gray-700
                "

              />

            </div>

            <button

              onClick={sendMessage}

              disabled={!text.trim()}

              className="
                h-16
                w-16
                rounded-3xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-105
                transition-all
                duration-300
                disabled:opacity-50
                disabled:hover:scale-100
              "

            >

              <Send size={24} />

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}