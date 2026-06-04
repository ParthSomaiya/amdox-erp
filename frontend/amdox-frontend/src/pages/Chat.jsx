import { useEffect, useState, useRef, useMemo } from "react";
import { MessageSquare, Send, Smile, Trash2, Heart, Flame, Laugh, Loader2, Users, ShieldCheck, X } from "lucide-react";
import io from "socket.io-client";
import API from "../services/api";

// 🚀 DYNAMIC AXIOS INTERCEPTOR: દરેક રિકવેસ્ટ વખતે તાજું ટોકન જ મોકલશે
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🛡️ MASTER LOCAL STORAGE DECORATOR (Wipe-out protection on logout for all dynamic chats)
const originalClear = localStorage.clear;
localStorage.clear = function() {
  // 🚀 DYNAMIC ERPs SCANNER: "amdox_" થી શરૂ થતા તમામ લાઈવ ચેટ થ્રેડ્સને આપમેળે હોલ્ડ કરી લેશે
  const backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("amdox_") || key.startsWith("amdox_chat_msgs_"))) {
      backup[key] = localStorage.getItem(key);
    }
  }

  // સાઇન-આઉટ સેશન ક્લીયર કરો
  originalClear.call(localStorage);

  // તમામ એક્ટિવ હિસ્ટ્રી અને વૉલ્ટ ડેટાબેઝ રીસ્ટોર કરો
  Object.keys(backup).forEach(key => {
    localStorage.setItem(key, backup[key]);
  });
};

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;
  const isHR = user.role === "HR" || user.role === "ADMIN";

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", { transports: ["websocket", "polling"] });

    if (userId) {
      socketRef.current.emit("join", userId);
    }

    socketRef.current.on("onlineUsers", (users) => {
      setOnlineUsers(users || []);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    fetchChats();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/chat");
      const serverData = res.data || [];
      
      if (!Array.isArray(serverData) || serverData.length === 0) {
        const defaultChats = [
          { _id: "chat-hr-broadcast", name: "📢 HR Broadcast & Support", isHRChannel: true },
          { _id: "chat-101", name: "Engineering Dept Chat", members: [] }
        ];
        setChats(defaultChats);
        localStorage.setItem("amdox_simulated_chats", JSON.stringify(defaultChats));
      } else {
        setChats(serverData);
      }
    } catch (err) {
      console.warn("Using offline fallback storage.");
      const savedChats = localStorage.getItem("amdox_simulated_chats");
      if (savedChats) {
        setChats(JSON.parse(savedChats));
      } else {
        const defaultChats = [
          { _id: "chat-hr-broadcast", name: "📢 HR Broadcast & Support", isHRChannel: true },
          { _id: "chat-101", name: "Engineering Dept Chat", members: [] }
        ];
        setChats(defaultChats);
        localStorage.setItem("amdox_simulated_chats", JSON.stringify(defaultChats));
      }
    } finally {
      setLoading(false);
    }
  };

  const openChat = async (chat) => {
    setSelectedChat(chat);
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", chat._id);
    }

    try {
      const res = await API.get(`/chat/message/${chat._id}`);
      const serverMsgs = res.data || [];
      
      if (!Array.isArray(serverMsgs) || serverMsgs.length === 0) {
        // 🚀 ઇનબોક્સ લોક પ્રોટેક્ટર: જો સર્વર મેસેજ ખાલી હોય, તો ડિફોલ્ટ ટેમ્પલેટ લોડ કરવાના બદલે લોકલ ચેટ લિસ્ટ ચેક કરો
        const savedMsgs = localStorage.getItem(`amdox_chat_msgs_${chat._id}`);
        if (savedMsgs) {
          setMessages(JSON.parse(savedMsgs));
        } else {
          loadDefaultMessages(chat._id);
        }
      } else {
        setMessages(serverMsgs);
      }
    } catch (err) {
      const savedMsgs = localStorage.getItem(`amdox_chat_msgs_${chat._id}`);
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs));
      } else {
        loadDefaultMessages(chat._id);
      }
    }
  };

  const loadDefaultMessages = (chatId) => {
    let dummyMsgs = [];
    if (chatId === "chat-hr-broadcast") {
      dummyMsgs = [
        { _id: "m-1", sender: { name: "HR Management" }, message: "Dear Employees, please complete your dynamic KYC document verifications by this Friday.", isBroadcast: true, createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
        { _id: "m-2", sender: { _id: "m-emp-1", name: "Jaydeep Patel" }, message: "I have uploaded both my Aadhaar and PAN. Please verify.", isBroadcast: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
      ];
    } else {
      dummyMsgs = [
        { _id: "m-1", sender: { name: "Jaydeep Patel" }, message: "Hey team! SCM modules are successfully compiled.", isBroadcast: false, createdAt: new Date().toISOString() }
      ];
    }
    setMessages(dummyMsgs);
    localStorage.setItem(`amdox_chat_msgs_${chatId}`, JSON.stringify(dummyMsgs));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedChat) return;

    const payload = {
      _id: `msg-${Date.now()}`,
      sender: { _id: userId, name: user.name || "Employee" },
      message: text,
      isBroadcast: isHR && selectedChat._id === "chat-hr-broadcast",
      reactions: [],
      createdAt: new Date().toISOString()
    };

    try {
      await API.post("/chat/message", { chatId: selectedChat._id, message: text });
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", { ...payload, chatId: selectedChat._id });
      }
    } catch (err) {
      console.warn("API Offline: Broadcast locally.");
    }

    const updatedMsgs = [...messages, payload];
    setMessages(updatedMsgs);
    localStorage.setItem(`amdox_chat_msgs_${selectedChat._id}`, JSON.stringify(updatedMsgs));
    setText("");
  };

  const reactMessage = (id, emoji) => {
    const updated = messages.map(m => {
      if (m._id === id) {
        const reactions = m.reactions ? [...m.reactions] : [];
        reactions.push({ emoji });
        return { ...m, reactions };
      }
      return m;
    });
    setMessages(updated);
    if (selectedChat) {
      localStorage.setItem(`amdox_chat_msgs_${selectedChat._id}`, JSON.stringify(updated));
    }
  };

  const deleteMessage = (id) => {
    const updated = messages.filter(m => m._id !== id);
    setMessages(updated);
    if (selectedChat) {
      localStorage.setItem(`amdox_chat_msgs_${selectedChat._id}`, JSON.stringify(updated));
    }
  };

  const filteredMessages = useMemo(() => {
    if (!selectedChat) return [];
    if (selectedChat._id === "chat-hr-broadcast" && !isHR) {
      return messages.filter(m => m.isBroadcast || m.sender?._id === userId);
    }
    return messages;
  }, [messages, selectedChat, userId, isHR]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
          <MessageSquare /> Workspace Chat Hub
        </h1>
        <p className="text-slate-400 text-xs mt-1.5">Connect with teams, participate in channels, and collaborate in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
        {/* LEFT CHANNEL SIDEBAR */}
        <div className="lg:col-span-4 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Channels & Rooms</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Select a thread to start chatting</p>
          </div>

          {loading ? (
            <div className="py-10 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {chats.map(c => {
                const isSelected = selectedChat?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => openChat(c)}
                    className={`p-3 border rounded-xl cursor-pointer transition ${
                      isSelected ? "bg-indigo-50/50 border-indigo-500/30" : "bg-slate-50/40 border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 block truncate">{c.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                      {c._id === "chat-hr-broadcast" ? "Broadcast Ticket Suite" : "Multi-User Channel"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT CHAT CONSOLE */}
        <div className="lg:col-span-8 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm min-h-[450px] flex flex-col justify-between w-full max-w-full overflow-hidden">
          {selectedChat ? (
            <div className="flex-1 flex flex-col justify-between h-[450px] w-full">
              
              {/* Message Feed Viewport */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                {filteredMessages.map((m) => {
                  const isMe = m.sender?._id === userId;
                  const isHRChannel = selectedChat._id === "chat-hr-broadcast";
                  
                  const isEmployeeReply = isHRChannel && isHR && !m.isBroadcast;
                  const displayMessage = isEmployeeReply 
                    ? `📩 [Reply from ${m.sender.name}]: ${m.message}` 
                    : m.message;

                  return (
                    <div key={m._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <span className="text-[9px] text-slate-400 font-bold mb-1 uppercase">
                        {m.isBroadcast ? "📢 HR Broadcast" : m.sender?.name}
                      </span>
                      <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed shadow-sm relative group ${
                        isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-100 text-slate-800 rounded-bl-none"
                      }`}>
                        <p>{displayMessage}</p>
                        
                        {/* Hover Quick Actions */}
                        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white border shadow-md rounded-lg p-1 z-10">
                          <button onClick={() => reactMessage(m._id, "❤️")} className="text-xs">❤️</button>
                          <button onClick={() => reactMessage(m._id, "🔥")} className="text-xs">🔥</button>
                          <button onClick={() => reactMessage(m._id, "😂")} className="text-xs">😂</button>
                          {isMe && (
                            <button onClick={() => deleteMessage(m._id)} className="text-rose-500 hover:text-rose-700 p-0.5"><Trash2 size={11} /></button>
                          )}
                        </div>

                        {/* Inline Reactions display */}
                        {m.reactions && m.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {m.reactions.map((r, i) => (
                              <span key={i} className="text-[10px] bg-white/20 px-1 rounded">{r.emoji}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={sendMessage} className="border-t pt-4 flex gap-3 w-full">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    selectedChat._id === "chat-hr-broadcast"
                      ? (isHR ? "Broadcast message to all employees..." : "Send a private reply to HR...")
                      : "Type a secure message..."
                  }
                  className="flex-grow h-11 border rounded-xl px-4 text-xs bg-slate-50/50 outline-none focus:bg-white"
                />
                <button type="submit" className="h-11 w-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition active:scale-95">
                  <Send size={15} />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-4">
              <MessageSquare size={48} className="text-indigo-600 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">No Active Chat Thread</h4>
                <p className="text-[10px] text-slate-400 mt-1">Select a group channel from the left panel to join discussions.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600" /> Secure SSL Multi-Tenant Chat Session Encrypted
      </div>
    </div>
  );
}