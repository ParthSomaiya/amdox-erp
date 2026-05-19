import { useEffect, useState } from "react";
import API from "../services/api";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = async () => {
    await API.post("/chat", {
      senderId: "me",
      receiverId: "all",
      message: text,
    });

    setText("");
  };

  return (
    <div className="p-4">
      <h1>💬 Team Chat</h1>

      <div className="h-80 overflow-y-auto border p-2">
        {messages.map((m, i) => (
          <p key={i}>{m.message}</p>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2"
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}