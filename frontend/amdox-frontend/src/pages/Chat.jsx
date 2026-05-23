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


  // ==========================
  // REACT MESSAGE
  // ==========================

  const reactMessage =
    async (id, emoji) => {

      await API.put(
        `/chat/reaction/${id}`,
        { emoji }
      );

      const res =
        await API.get(
          `/chat/message/${selectedChat._id}`
        );

      setMessages(res.data);

    };


  // ==========================
  // DELETE MESSAGE
  // ==========================

  const deleteMessage =
    async (id) => {

      await API.put(
        `/chat/delete/${id}`
      );

      const res =
        await API.get(
          `/chat/message/${selectedChat._id}`
        );

      setMessages(res.data);

    };


  return (

    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}

      <div className="w-1/4 border-r bg-white p-4">

        <h2 className="text-2xl font-bold mb-5">
          Chats
        </h2>

        {chats.map((c) => (

          <div
            key={c._id}

            onClick={() =>
              openChat(c)
            }

            className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-100"
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
              className="mb-5"
            >

              <p className="font-bold mb-1">
                {m.sender?.name}
              </p>

              <div className="bg-white shadow p-3 rounded inline-block">

                {m.message}

                {m.edited && (
                  <span className="text-xs text-gray-500 ml-2">
                    edited
                  </span>
                )}

              </div>

              {/* REACTIONS */}

              <div className="flex gap-2 mt-2">

                <button
                  onClick={() =>
                    reactMessage(
                      m._id,
                      "❤️"
                    )
                  }
                >
                  ❤️
                </button>

                <button
                  onClick={() =>
                    reactMessage(
                      m._id,
                      "🔥"
                    )
                  }
                >
                  🔥
                </button>

                <button
                  onClick={() =>
                    reactMessage(
                      m._id,
                      "😂"
                    )
                  }
                >
                  😂
                </button>

                <button
                  onClick={() =>
                    deleteMessage(
                      m._id
                    )
                  }
                  className="text-red-500"
                >
                  Delete
                </button>

              </div>


              {/* SHOW REACTIONS */}

              <div className="flex gap-2 mt-1">

                {m.reactions?.map(
                  (r, i) => (

                    <span key={i}>
                      {r.emoji}
                    </span>

                  )
                )}

              </div>

            </div>

          ))}

          <p className="text-sm text-gray-500">
            {typing}
          </p>

        </div>


        {/* INPUT */}

        {selectedChat && (

          <div className="border-t bg-white p-4 flex gap-3">

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