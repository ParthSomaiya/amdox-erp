import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import io from "socket.io-client";

const socket =
  io("http://localhost:5000");

export default function Chat() {

  const [chats, setChats] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [selectedChat,
    setSelectedChat] =
    useState(null);

  const [text, setText] =
    useState("");

  const [typing, setTyping] =
    useState("");

  const [onlineUsers,
    setOnlineUsers] =
    useState([]);


  // ==========================
  // LOAD CHATS
  // ==========================

  useEffect(() => {

    API.get("/chat")
      .then((res) =>
        setChats(res.data)
      );

  }, []);


  // ==========================
  // ONLINE USERS
  // ==========================

  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    socket.emit(
      "join",
      user._id
    );

    socket.on(
      "onlineUsers",
      (users) => {

        setOnlineUsers(users);

      }
    );

  }, []);


  // ==========================
  // RECEIVE MESSAGE
  // ==========================

  useEffect(() => {

    socket.on(
      "receiveMessage",
      (msg) => {

        setMessages((prev) => [
          ...prev,
          msg,
        ]);

      }
    );

    socket.on(
      "typing",
      (data) => {

        setTyping(
          `${data.name} typing...`
        );

        setTimeout(() => {
          setTyping("");
        }, 2000);

      }
    );

  }, []);


  // ==========================
  // OPEN CHAT
  // ==========================

  const openChat =
    async (chat) => {

      setSelectedChat(chat);

      socket.emit(
        "joinRoom",
        chat._id
      );

      const res =
        await API.get(
          `/chat/message/${chat._id}`
        );

      setMessages(res.data);

    };


  // ==========================
  // SEND MESSAGE
  // ==========================

  const sendMessage =
    async () => {

      if (!text) return;

      const res =
        await API.post(
          "/chat/message",
          {
            chatId:
              selectedChat._id,

            message: text,
          }
        );

      socket.emit(
        "sendMessage",
        {
          ...res.data,
          chatId:
            selectedChat._id,
        }
      );

      setText("");

    };


  return (

    <div className="flex h-screen">

      {/* SIDEBAR */}

      <div className="w-1/4 border-r p-4">

        <h2 className="text-2xl font-bold mb-5">
          Chats
        </h2>

        {chats.map((c) => (

          <div
            key={c._id}

            onClick={() =>
              openChat(c)
            }

            className="p-3 border rounded mb-2 cursor-pointer"
          >

            <p className="font-semibold">
              {c.name ||
                c.members
                  .map(
                    (m) => m.name
                  )
                  .join(", ")}
            </p>

            <p className="text-sm text-green-600">
              {
                c.members.some(
                  (m) =>
                    onlineUsers.includes(
                      m._id
                    )
                )
                  ? "Online"
                  : "Offline"
              }
            </p>

          </div>

        ))}

      </div>


      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-5">

          {messages.map((m) => (

            <div
              key={m._id}
              className="mb-3"
            >

              <p className="font-bold">
                {m.sender?.name}
              </p>

              <div className="bg-gray-100 p-3 rounded inline-block">
                {m.message}
              </div>

            </div>

          ))}

          <p className="text-sm text-gray-500">
            {typing}
          </p>

        </div>


        {/* INPUT */}

        {selectedChat && (

          <div className="border-t p-4 flex gap-3">

            <input
              value={text}

              onChange={(e) => {

                setText(
                  e.target.value
                );

                socket.emit(
                  "typing",
                  {
                    chatId:
                      selectedChat._id,

                    name: "User",
                  }
                );

              }}

              placeholder="Type message..."

              className="border p-3 flex-1 rounded"
            />

            <button
              onClick={sendMessage}

              className="bg-blue-600 text-white px-5 rounded"
            >
              Send
            </button>

          </div>

        )}

      </div>

    </div>

  );

}