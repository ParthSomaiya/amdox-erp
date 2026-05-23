import { useState } from "react";
import API from "../services/api";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const send = async () => {
    const res = await API.post("/ai/chat", { message });
    setReply(res.data.reply);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full"
        placeholder="Ask AI..."
      />

      <button
        onClick={send}
        className="bg-blue-600 text-white px-4 py-2 mt-3"
      >
        Ask
      </button>

      {reply && (
        <div className="mt-5 p-4 bg-gray-100 rounded">
          {reply}
        </div>
      )}
    </div>
  );
}