import { useEffect, useRef, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { Send, Users, MessageSquare, Clock, ShieldCheck, CheckCheck, Loader2 } from "lucide-react";

// ગ્લોબલ સોકેટ કનેક્શન (સૌથી વિશ્વસનીય સેટઅપ)
const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

export default function TeamChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const messagesEndRef = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const room = "general"; // રૂમનું નામ

  // મેસેજ આવતાની સાથે જ નીચે સ્ક્રોલ કરવા માટે
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // સોકેટ કનેક્શન અને ઇવેન્ટ લિસનર્સ સેટઅપ
  useEffect(() => {
    // કમ્પોનન્ટ લોડ થતાં જ લોકલ હિસ્ટ્રી લોડ કરવી
    const localHistory = localStorage.getItem(`amdox_chat_${room}`);
    if (localHistory) {
      setMessages(JSON.parse(localHistory));
    }
    setLoading(false);

    // કનેક્શન સફળ થવા પર લોગ અને રૂમ જોઈન કરવો
    const onConnect = () => {
      console.log("✅ Socket Connected:", socket.id);
      socket.emit("joinRoom", room); // 🔹 ફાઇનલ ફિક્સ: બેકએન્ડ માટે ફક્ત રૂમનું નામ મોકલો
    };

    // સર્વર પરથી નવો મેસેજ મળવા પર
    const onReceiveMessage = (message) => {
      console.log("📥 Message Received:", message);
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id || (m.createdAt === message.createdAt && m.sender.name === message.sender.name));
        if (exists) return prev;
        
        const updated = [...prev, message];
        localStorage.setItem(`amdox_chat_${room}`, JSON.stringify(updated));
        return updated;
      });
    };

    // રૂમમાં ઓનલાઈન યુઝર્સની સંખ્યા અપડેટ કરવા
    const onRoomUsers = (users) => {
      setOnlineUsers(users?.length || 1);
    };

    // સોકેટ ઇવેન્ટ્સને રજીસ્ટર કરો
    socket.on("connect", onConnect);
    socket.on("receiveMessage", onReceiveMessage);
    socket.on("roomUsers", onRoomUsers);

    // કમ્પોનન્ટ બંધ થતાં કનેક્શન બંધ કરવું
    return () => {
      socket.off("connect", onConnect);
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("roomUsers", onRoomUsers);
    };
  }, [room]);

  // મેસેજ મોકલવાનું મુખ્ય ફંક્શન
  const sendMessage = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const messagePayload = {
      _id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      room: room,
      text: text.trim(),
      sender: {
        id: user?._id || "unknown-id",
        name: user?.name || "User",
        role: user?.role || "EMPLOYEE",
      },
      createdAt: new Date().toISOString(),
    };

    // સોકેટ દ્વારા બ્રોડકાસ્ટ કરો
    socket.emit("sendMessage", messagePayload);

    // મોકલનારની સ્ક્રીન અને લોકલ સ્ટોરેજ અપડેટ કરો
    setMessages((prev) => {
      const updated = [...prev, messagePayload];
      localStorage.setItem(`amdox_chat_${room}`, JSON.stringify(updated));
      return updated;
    });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">Secure Communication Channel</span>
          <h1 className="text-2xl font-black flex items-center gap-2">💬 Team Workspace Chat</h1>
          <p className="text-xs text-slate-400">Broadcast updates as HR/Admin or reply instantly as Employee</p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 backdrop-blur-md">
          <Users size={16} className="text-indigo-300 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">{onlineUsers} Online</span>
        </div>
      </div>

      {/* Chat Messenger Container */}
      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden flex flex-col h-[620px]">
        {/* Active room indicator bar */}
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider"># General Announcements Room</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Secured via Socket.io & LocalSync</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
              <p className="text-xs text-slate-400 font-bold">Syncing workspace messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-8">
              <MessageSquare size={42} className="text-slate-300" />
              <h4 className="font-extrabold text-slate-700 text-sm">No Conversations Registered</h4>
              <p className="text-xs text-slate-400 max-w-xs">Be the first to drop an announcement or ask a question.</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const senderId = m.sender?.id || "unknown";
              const currentUserId = user?._id || user?.id || "local";
              const isMe = String(senderId) === String(currentUserId);
              const isHR = m.sender?.role === "HR" || m.sender?.role === "ADMIN";

              return (
                <div key={m._id || idx} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-slate-600">{m.sender?.name || "User"}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${isHR ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-100 text-slate-600"}`}>
                        {isHR ? "HR/ADMIN" : "EMPLOYEE"}
                      </span>
                    </div>

                    <div className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed ${isMe ? "bg-indigo-600 text-white font-semibold rounded-br-none" : "bg-white border text-slate-700 rounded-bl-none"}`}>
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <div className={`flex items-center gap-1.5 mt-2 justify-end text-[9px] ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                        <Clock size={10} />
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {isMe && <CheckCheck size={11} className="text-indigo-200" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message or reply..."
            className="flex-1 h-12 border rounded-xl px-4 text-xs bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 flex items-center justify-center transition-all shrink-0 shadow-md"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}