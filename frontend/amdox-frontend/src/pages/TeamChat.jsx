import { useEffect, useRef, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { Send, Users, MessageSquare, Clock, ShieldCheck, CheckCheck, Loader2, Smile, Search, Hash, Volume2 } from "lucide-react";

// ગ્લોબલ સોકેટ કનેક્શન
const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: true,
});

export default function TeamChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState("general"); // general, hr_direct
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return { name: "Guest User", role: "EMPLOYEE", _id: "guest-101" };
    }
  }, []);

  const isAdminOrHR = user?.role === "ADMIN" || user?.role === "HR";

  // ક્રોસ-ટેબ અને સોકેટ સિંકિંગ માટે યુનિફાઇડ સ્ટોરેજ કી
  const unifiedStorageKey = useMemo(() => {
    return `amdox_chat_${activeChannel}`;
  }, [activeChannel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  // 🔄 લાઇવ સોકેટ એન્જિન અને ક્રોસ-ટેબ હાઇબ્રિડ સિંકિંગ
  useEffect(() => {
    setLoading(true);

    // ૧. સોકેટ રૂમ સ્વિચિંગ એક્શન
    const joinActiveRoom = () => {
      if (socket.connected) {
        console.log(`📡 Joining Active Room Cluster: ${activeChannel}`);
        socket.emit("joinRoom", activeChannel);
      }
    };

    joinActiveRoom();

    // ૨. લોકલ / ક્રોસ-ટેબ હિસ્ટ્રી લોડર
    const loadCachedHistory = () => {
      const cached = localStorage.getItem(unifiedStorageKey);
      if (cached) {
        setMessages(JSON.parse(cached));
      } else {
        setMessages([
          {
            _id: "m-default",
            room: activeChannel,
            text: "Welcome to AMDOX Secure Communication Channel! Admin/HR can broadcast announcements here, and employees can reply instantly.",
            sender: { id: "admin-system", name: "System Orchestrator", role: "ADMIN" },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            reactions: ["🔥", "👍"]
          }
        ]);
      }
    };

    loadCachedHistory();
    setLoading(false);

    // ૩. સોકેટ ઇવેન્ટ રિસીવર્સ
    const handleConnect = () => {
      console.log("✅ Socket Connected Session ID:", socket.id);
      socket.emit("joinRoom", activeChannel);
    };

    const handleReceiveMessage = (message) => {
      console.log("📥 Live Message Broadcast Received:", message);
      if (message.room !== activeChannel) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        
        const updated = [...prev, message];
        localStorage.setItem(unifiedStorageKey, JSON.stringify(updated));
        return updated;
      });
    };

    const handleRoomUsers = (users) => {
      setOnlineUsers(users?.length || 1);
    };

    const handleUserTyping = (data) => {
      if (data.userId !== user?._id && data.room === activeChannel) {
        setTypingUser(data.name);
        const timer = setTimeout(() => setTypingUser(""), 2000);
        return () => clearTimeout(timer);
      }
    };

    const handleReceiveReaction = (data) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id === data.messageId) {
            const currentReactions = m.reactions || [];
            if (!currentReactions.includes(data.emoji)) {
              return { ...m, reactions: [...currentReactions, data.emoji] };
            }
          }
          return m;
        })
      );
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("roomUsers", handleRoomUsers);
    socket.on("userTyping", handleUserTyping);
    socket.on("receiveReaction", handleReceiveReaction);

    // ૪. અલ્ટીમેટ ક્રોસ-ટેબ સિંકિંગ લિસનર (બધા જ ટેબ્સ/વિન્ડોઝ માટે)
    const handleStorageChange = (e) => {
      if (e.key === unifiedStorageKey) {
        console.log("🔄 Cross-Tab Update Synced:", e.newValue);
        if (e.newValue) {
          setMessages(JSON.parse(e.newValue));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("roomUsers", handleRoomUsers);
      socket.off("userTyping", handleUserTyping);
      socket.off("receiveReaction", handleReceiveReaction);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [activeChannel, unifiedStorageKey, user?._id]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    socket.emit("typing", {
      room: activeChannel,
      userId: user?._id,
      name: user?.name || "Someone"
    });
  };

  // મેસેજ સેન્ડ લોજિક
  const sendMessage = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const messagePayload = {
      _id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      room: activeChannel,
      text: text.trim(),
      sender: {
        id: user?._id || user?.id || "unknown",
        name: user?.name || "User",
        role: user?.role || "EMPLOYEE",
      },
      createdAt: new Date().toISOString(),
      reactions: []
    };

    // ૧. સોકેટ સર્વર દ્વારા બ્રોડકાસ્ટ કરો
    socket.emit("sendMessage", messagePayload);

    // ૨. પોતાના સ્ટેટ અને યુનિફાઇડ લોકલ સ્ટોરેજમાં સેવ કરો (બીજા ટેબ્સ માટે)
    setMessages((prev) => {
      const updated = [...prev, messagePayload];
      localStorage.setItem(unifiedStorageKey, JSON.stringify(updated));
      return updated;
    });
    setText("");
  };

  const handleAddReaction = (messageId, emoji) => {
    socket.emit("addReaction", { messageId, emoji, room: activeChannel });
    setMessages((prev) =>
      prev.map((m) => {
        if (m._id === messageId) {
          const currentReactions = m.reactions || [];
          if (!currentReactions.includes(emoji)) {
            return { ...m, reactions: [...currentReactions, emoji] };
          }
        }
        return m;
      })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter(m => m.text?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [messages, searchQuery]);

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      {/* 🚀 Top Header Panel */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block">Digital Workspace Connect</span>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Hash className="text-indigo-400" /> WhatsApp Business Chat
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Real-time chat. HR/Admin can post announcements, and employees can discuss and reply instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md shrink-0 relative z-10">
          <Users size={16} className="text-indigo-300 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">{onlineUsers} Members Online</span>
        </div>
      </div>

      {/* 🚀 Dual-Pane Chat Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 📋 LEFT COLUMN: Channels Selector */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-[28px] p-5 shadow-sm space-y-5 h-[620px] flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Workspace Rooms</h3>
              <p className="text-[10px] text-slate-400 mt-1">Select channel room to participate</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveChannel("general")}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                  activeChannel === "general" 
                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-1 ring-indigo-100" 
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Volume2 size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                    # Announcements <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">HR broadcasts & general news</p>
                </div>
              </button>

              <button
                onClick={() => setActiveChannel("hr_direct")}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                  activeChannel === "hr_direct" 
                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-1 ring-indigo-100" 
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs"># Employee Feedback</h4>
                  <p className="text-[10px] text-slate-400 mt-1">All employee direct discussion line</p>
                </div>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border rounded-2xl text-[11px] text-slate-500 font-semibold flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
            <span>MFA Identity Verification Active</span>
          </div>
        </aside>

        {/* 💬 RIGHT COLUMN: WhatsApp Style Main Thread Screen */}
        <main className="lg:col-span-8 bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden flex flex-col h-[620px] justify-between">
          
          <div className="p-4 bg-slate-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                #
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  {activeChannel === "general" ? "General Workspace Announcements" : "Employee Feedback Portal"}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Real-time bi-directional messaging stream</span>
              </div>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search text..."
                className="w-full h-8 pl-8 pr-3 rounded-lg border bg-white outline-none text-[11px] font-semibold text-slate-600 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
                <p className="text-xs text-slate-400 font-bold">Syncing messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-8">
                <MessageSquare size={36} className="text-slate-300 animate-pulse" />
                <h4 className="font-extrabold text-slate-700 text-sm">No Messages Found</h4>
                <p className="text-xs text-slate-400 max-w-xs">Be the first to ask or post an update.</p>
              </div>
            ) : (
              filteredMessages.map((m, idx) => {
                const isMe = String(m.sender?.id) === String(user?._id || user?.id);
                const isHR = m.sender?.role === "HR" || m.sender?.role === "ADMIN";

                return (
                  <div key={m._id || idx} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}>
                    <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                      
                      <div className="flex items-center gap-1.5 mb-1.5 px-1.5">
                        <span className="text-[10px] font-bold text-slate-600">{m.sender?.name || "User"}</span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                          isHR ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          {isHR ? "HR/ADMIN" : "EMPLOYEE"}
                        </span>
                      </div>

                      <div className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed group relative ${
                        isHR 
                          ? "bg-slate-900 text-slate-100 border-2 border-indigo-500/20 shadow-indigo-500/5 rounded-tl-none" 
                          : isMe 
                            ? "bg-indigo-600 text-white font-semibold rounded-br-none" 
                            : "bg-white border border-slate-200 text-slate-700 rounded-bl-none"
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        
                        <div className={`flex items-center gap-1.5 mt-2.5 justify-end text-[9px] ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                          <Clock size={10} />
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {isMe && <CheckCheck size={11} className="text-indigo-200" />}
                        </div>

                        {/* Hover Quick Emoji reactions */}
                        <div className={`absolute -top-4 ${isMe ? "right-0" : "left-0"} hidden group-hover:flex items-center gap-1 bg-white border shadow-lg rounded-full px-2 py-0.5 z-10 transition-all`}>
                          {["👍", "❤️", "🔥", "😂", "🎉"].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleAddReaction(m._id, emoji)}
                              className="hover:scale-125 text-xs transition"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {m.reactions && m.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2.5 flex-wrap">
                            {m.reactions.map((emoji, rIdx) => (
                              <span key={rIdx} className="bg-slate-50 border px-1.5 py-0.5 rounded-full text-[10px] shadow-sm select-none">
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {typingUser && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold animate-pulse p-2">
                <MessageSquare size={14} />
                <span>{typingUser} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Message Input Bar Form */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-4 items-center shrink-0">
            <div className="relative flex-grow">
              <input
                type="text"
                value={text}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Write announcements as HR, or write a reply here..."
                className="w-full h-12 border rounded-xl pl-4 pr-10 text-xs bg-slate-50/50 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setText((prev) => prev + "📢 IMPORTANT WORKSPACE UPDATE: ")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              >
                <Smile size={18} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:text-slate-400 flex items-center justify-center transition shadow-md shrink-0"
            >
              <Send size={16} />
            </button>
          </form>

        </main>
      </div>
    </div>
  );
}