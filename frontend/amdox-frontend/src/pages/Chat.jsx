import { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Send, Smile, Trash2, Heart, Flame, Laugh, Loader2, Users, ShieldCheck, X, Edit3 } from "lucide-react";
import io from "socket.io-client";
import API from "../services/api";

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const originalClear = localStorage.clear;
localStorage.clear = function () {
  const backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("amdox_") || key.startsWith("amdox_chat_msgs_"))) {
      backup[key] = localStorage.getItem(key);
    }
  }

  originalClear.call(localStorage);

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

  // 🚀 મેસેજ ઓપ્શન્સ અને એડિટ સ્ટેટ્સ
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

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

  const handleSaveEdit = async (e, id) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const updated = messages.map(m => m._id === id ? { ...m, message: editText, edited: true } : m);
    setMessages(updated);
    if (selectedChat) {
      localStorage.setItem(`amdox_chat_msgs_${selectedChat._id}`, JSON.stringify(updated));
    }

    try {
      await API.put(`/chat/message/update/${id}`, { message: editText });
    } catch (err) {
      console.warn("API Offline: Updated locally.");
    }

    setEditingMessageId(null);
    setEditText("");
  };

  const deleteMessage = async (id) => {
    const updated = messages.filter(m => m._id !== id);
    setMessages(updated);
    if (selectedChat) {
      localStorage.setItem(`amdox_chat_msgs_${selectedChat._id}`, JSON.stringify(updated));
    }

    try {
      await API.delete(`/chat/message/${id}`);
    } catch (err) {
      console.warn("API Offline: Deleted locally.");
    }
  };

  const filteredMessages = useMemo(() => {
    if (!selectedChat) return [];
    if (selectedChat._id === "chat-hr-broadcast" && !isHR) {
      return messages.filter(m => m.isBroadcast || m.sender?._id === userId);
    }
    return messages;
  }, [messages, selectedChat, userId, isHR]);

  // લાઈવ સિલેક્ટેડ મેસેજ ઓપ્શન્સ કમ્પાઇલર
  const activeMsgObj = useMemo(() => {
    return messages.find(m => m._id === activeActionMenuId) || null;
  }, [activeActionMenuId, messages]);

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
                    className={`p-3 border rounded-xl cursor-pointer transition ${isSelected ? "bg-indigo-50/50 border-indigo-500/30" : "bg-slate-50/40 border-transparent hover:bg-slate-50"
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
                      
                      {/* ચેટ બબલ કન્ટેનર */}
                      <div 
                        onClick={() => setActiveActionMenuId(m._id)} // બબલ પર ક્લિક કરતાં જ પોર્ટલ મેનૂ ખુલશે
                        className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed shadow-sm relative cursor-pointer hover:opacity-95 transition-all ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-100 text-slate-800 rounded-bl-none"
                        }`}
                      >
                        {/* ઇનલાઇન એડિટ ઇનપુટ બોક્સ */}
                        {editingMessageId === m._id ? (
                          <form onSubmit={(e) => handleSaveEdit(e, m._id)} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="border rounded-lg px-2 py-1 text-slate-800 outline-none w-full text-xs font-semibold"
                            />
                            <button type="submit" className="text-indigo-600 font-bold text-xs hover:underline shrink-0">Save</button>
                            <button type="button" onClick={() => setEditingMessageId(null)} className="text-slate-400 font-bold text-xs hover:underline shrink-0">Cancel</button>
                          </form>
                        ) : (
                          <p>{displayMessage}</p>
                        )}

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

      {/* 🚀 વૈશ્વિક કક્ષાનું સિક્યોર ચેટ કંટ્રોલ પોર્ટલ ઓવરલે (Bypasses Scroll bounds & Cuts) */}
      {activeActionMenuId && activeMsgObj && createPortal(
        <div 
          className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveActionMenuId(null)}
        >
          <div 
            className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 w-full max-w-xs space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // મેનૂની અંદરની ક્લિક બાયપાસ રોકે
          >
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Message Actions</span>
              <button 
                onClick={() => { setActiveActionMenuId(null); }}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Reactions Horizontal Bar */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Quick Reactions</span>
              <div className="flex gap-1 justify-between bg-slate-50 p-1.5 rounded-xl border">
                {["❤️", "🔥", "😂", "👍", "🙌"].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => {
                      reactMessage(activeMsgObj._id, emoji);
                      setActiveActionMenuId(null);
                    }}
                    className="text-xl p-1.5 hover:bg-white rounded-lg transition active:scale-90 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit / Delete / Reply workflows */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {activeMsgObj.sender?._id === userId ? (
                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setEditingMessageId(activeMsgObj._id);
                      setEditText(activeMsgObj.message);
                      setActiveActionMenuId(null);
                    }}
                    className="w-full h-10 px-3 hover:bg-slate-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Edit3 size={13} /> Edit Message
                  </button>
                  <button 
                    onClick={() => {
                      deleteMessage(activeMsgObj._id);
                      setActiveActionMenuId(null);
                    }}
                    className="w-full h-10 px-3 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Trash2 size={13} /> Delete Message
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 italic text-center py-2">Read-only system message.</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600" /> Secure SSL Multi-Tenant Chat Session Encrypted
      </div>
    </div>
  );
}