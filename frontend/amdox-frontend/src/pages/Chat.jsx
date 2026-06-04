import { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  MessageSquare, Send, Smile, Trash2, Heart, Flame, Laugh, Loader2, 
  Users, ShieldCheck, X, Edit3, CornerUpLeft, Radio, Search, Hash, 
  ChevronRight, Circle, User 
} from "lucide-react";
import io from "socket.io-client";
import API from "../services/api";

// API Request Token Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Preserving specific local storage items on clear
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
  const [searchQuery, setSearchQuery] = useState("");

  // Edit, Option & Reply States
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", { 
      transports: ["websocket", "polling"] 
    });

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
    setReplyToMessage(null);
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
        { 
          _id: "m-1", 
          sender: { name: "HR Management" }, 
          message: "Dear Employees, please complete your dynamic KYC document verifications by this Friday.", 
          isBroadcast: true, 
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() 
        },
        { 
          _id: "m-2", 
          sender: { _id: "m-emp-1", name: "Jaydeep Patel" }, 
          message: "I have uploaded both my Aadhaar and PAN. Please verify.", 
          isBroadcast: false, 
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() 
        }
      ];
    } else {
      dummyMsgs = [
        { 
          _id: "m-1", 
          sender: { name: "Jaydeep Patel" }, 
          message: "Hey team! SCM modules are successfully compiled.", 
          isBroadcast: false, 
          createdAt: new Date().toISOString() 
        }
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
      replyTo: replyToMessage ? { 
        _id: replyToMessage._id, 
        senderName: replyToMessage.sender?.name || "User", 
        message: replyToMessage.message 
      } : null,
      isBroadcast: isHR && selectedChat._id === "chat-hr-broadcast",
      reactions: [],
      createdAt: new Date().toISOString()
    };

    try {
      await API.post("/chat/message", { chatId: selectedChat._id, message: text, replyTo: payload.replyTo });
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
    setReplyToMessage(null);
  };

  const reactMessage = (id, emoji) => {
    const updated = messages.map(m => {
      if (m._id === id) {
        let reactions = m.reactions ? [...m.reactions] : [];
        const exists = reactions.some(r => r.emoji === emoji);

        if (exists) {
          reactions = reactions.filter(r => r.emoji !== emoji);
        } else {
          reactions.push({ emoji });
        }
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

  const activeMsgObj = useMemo(() => {
    return messages.find(m => m._id === activeActionMenuId) || null;
  }, [activeActionMenuId, messages]);

  const filteredChats = useMemo(() => {
    return chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50/50 text-slate-950 font-sans antialiased">
      {/* Top Professional Header Bar */}
      <header className="shrink-0 bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <MessageSquare size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-950 tracking-tight">Workspace Hub</h1>
            <p className="text-xs text-slate-500 font-medium">Real-time enterprise-grade collaboration portal</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
            <Circle className="fill-emerald-500 stroke-emerald-500" size={6} />
            <span>{onlineUsers.length} Online</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium border-l pl-4 border-slate-200">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 lg:p-6 gap-6">
        
        {/* Left Workspace Panel */}
        <section className="w-full md:w-80 lg:w-96 shrink-0 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">Channels & Teams</h3>
              <span className="text-[10px] px-2 py-0.5 font-bold text-slate-500 bg-slate-100 rounded-md uppercase tracking-wider">
                {chats.length} Threads
              </span>
            </div>
            
            {/* Elegant Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search direct channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          {/* Channels list Viewport */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <span className="text-xs font-semibold text-slate-400">Loading channels...</span>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">No active channels found</div>
            ) : (
              filteredChats.map(c => {
                const isSelected = selectedChat?._id === c._id;
                return (
                  <button
                    key={c._id}
                    onClick={() => openChat(c)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-150 flex items-start gap-3 group relative ${
                      isSelected 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-semibold" 
                        : "hover:bg-slate-100/80 text-slate-700 font-medium border border-transparent hover:border-slate-200/50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white"}`}>
                      {c._id === "chat-hr-broadcast" ? <Radio size={14} /> : <Hash size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs block truncate ${isSelected ? "text-white" : "text-slate-900"}`}>{c.name}</span>
                        <ChevronRight size={12} className={`shrink-0 transition-transform ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                      </div>
                      <span className={`text-[10px] block mt-0.5 font-medium ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                        {c._id === "chat-hr-broadcast" ? "Broadcasting Support" : "Multi-User Room"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Logged in User Section */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center border border-indigo-200 shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-950 block truncate leading-none mb-1">{user.name || "Default Staff"}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.role || "Employee"}</span>
            </div>
          </div>
        </section>

        {/* Right Chat Console Area */}
        <section className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {selectedChat ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Chat Viewport Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    {selectedChat._id === "chat-hr-broadcast" ? <Radio size={14} /> : <Hash size={14} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-950 tracking-tight uppercase">{selectedChat.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {selectedChat._id === "chat-hr-broadcast" ? "Broadcast messages only read-only mode for staffs" : "Open collaborative channel"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Feed Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/20 custom-scrollbar">
                {filteredMessages.map((m) => {
                  const isMe = m.sender?._id === userId;
                  const isHRChannel = selectedChat._id === "chat-hr-broadcast";

                  const isEmployeeReply = isHRChannel && isHR && !m.isBroadcast;
                  const displayMessage = isEmployeeReply
                    ? `📩 [Reply from ${m.sender.name}]: ${m.message}`
                    : m.message;

                  return (
                    <div key={m._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} group`}>
                      <span className="text-[9px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">
                        {m.isBroadcast ? "📢 HR Broadcast" : m.sender?.name}
                      </span>
                      
                      {/* Chat Bubble Layout */}
                      <div 
                        onClick={() => setActiveActionMenuId(m._id)}
                        className={`group/bubble max-w-[75%] p-3.5 rounded-2xl text-xs relative cursor-pointer hover:shadow-md transition-all duration-200 border ${
                          isMe 
                            ? "bg-indigo-600 text-white border-indigo-500 rounded-br-none" 
                            : "bg-white text-slate-800 border-slate-200 rounded-bl-none shadow-xs"
                        }`}
                      >
                        {/* Reply Connector Card */}
                        {m.replyTo && (
                          <div className={`p-2 rounded-xl text-[10px] mb-2 border-l-2 italic ${
                            isMe ? "bg-black/10 text-slate-200 border-indigo-300" : "bg-slate-50 text-slate-500 border-indigo-600"
                          }`}>
                            Replying to <span className="font-bold">{m.replyTo.senderName}</span>: "{m.replyTo.message}"
                          </div>
                        )}

                        {/* Inline Edit Input Box */}
                        {editingMessageId === m._id ? (
                          <form 
                            onSubmit={(e) => handleSaveEdit(e, m._id)} 
                            className="flex items-center gap-2 mt-1" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 outline-none w-full text-xs font-semibold focus:ring-2 focus:ring-indigo-600/25"
                            />
                            <button type="submit" className="text-indigo-600 font-bold text-xs hover:underline shrink-0">Save</button>
                            <button type="button" onClick={() => setEditingMessageId(null)} className="text-slate-400 font-bold text-xs hover:underline shrink-0">Cancel</button>
                          </form>
                        ) : (
                          <p className="leading-relaxed break-words font-medium">{displayMessage}</p>
                        )}

                        {/* Inline Reactions display */}
                        {m.reactions && m.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2.5 flex-wrap">
                            {m.reactions.map((r, i) => (
                              <button 
                                key={i} 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  reactMessage(m._id, r.emoji);
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded-md hover:scale-105 active:scale-95 transition-all ${
                                  isMe ? "bg-white/20 text-white hover:bg-white/30" : "bg-slate-100 border border-slate-200/60 text-slate-700 hover:bg-slate-200/50"
                                }`}
                              >
                                {r.emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Reply Component Preview Bar */}
              {replyToMessage && (
                <div className="px-4 py-3 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-950 rounded-t-xl animate-in slide-in-from-bottom-2 duration-150 shrink-0">
                  <span className="truncate font-medium">
                    Replying to <span className="font-bold">{replyToMessage.sender?.name || "Staff"}</span>: "{replyToMessage.message}"
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setReplyToMessage(null)}
                    className="text-indigo-600 hover:bg-indigo-100 p-1 rounded-md transition shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Chat Input form */}
              <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
                <form onSubmit={sendMessage} className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                      selectedChat._id === "chat-hr-broadcast"
                        ? (isHR ? "Broadcast message to all employees..." : "Send a private reply to HR...")
                        : "Type a secure message..."
                    }
                    className="flex-grow h-11 border border-slate-200 rounded-xl px-4 text-xs bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 transition"
                  />
                  <button 
                    type="submit" 
                    className="h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition active:scale-95 shadow-md shadow-indigo-600/10 shrink-0 gap-1.5 text-xs font-semibold"
                  >
                    <span>Send</span>
                    <Send size={13} />
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
                <MessageSquare size={28} />
              </div>
              <div className="max-w-xs">
                <h4 className="font-extrabold text-slate-900 text-sm">No Active Channel Selected</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                  Select a team channel or a support thread from the left panel to join the conversation.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Global Secure Chat Action Menu Portal Overlay */}
      {activeActionMenuId && activeMsgObj && createPortal(
        <div 
          className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveActionMenuId(null)}
        >
          <div 
            className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 w-full max-w-xs space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Message Actions</span>
              <button 
                onClick={() => { setActiveActionMenuId(null); }}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1 rounded-lg transition"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quick Reactions Horizontal Bar */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Quick Reactions</span>
              <div className="flex gap-1.5 justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/50">
                {["❤️", "🔥", "😂", "👍", "🙌"].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => {
                      reactMessage(activeMsgObj._id, emoji);
                      setActiveActionMenuId(null);
                    }}
                    className="text-xl p-1.5 hover:bg-white rounded-lg transition active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit / Delete / Reply workflows */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <button 
                onClick={() => {
                  setReplyToMessage(activeMsgObj);
                  setActiveActionMenuId(null);
                }}
                className="w-full h-10 px-3 hover:bg-indigo-50/50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2.5 transition"
              >
                <CornerUpLeft size={14} /> Reply to Message
              </button>

              {activeMsgObj.sender?._id === userId && (
                <div className="space-y-1 pt-1.5 border-t border-dashed border-slate-200">
                  <button 
                    onClick={() => {
                      setEditingMessageId(activeMsgObj._id);
                      setEditText(activeMsgObj.message);
                      setActiveActionMenuId(null);
                    }}
                    className="w-full h-10 px-3 hover:bg-indigo-50/50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2.5 transition"
                  >
                    <Edit3 size={14} /> Edit Message
                  </button>
                  <button 
                    onClick={() => {
                      deleteMessage(activeMsgObj._id);
                      setActiveActionMenuId(null);
                    }}
                    className="w-full h-10 px-3 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2.5 transition"
                  >
                    <Trash2 size={14} /> Delete Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Styled custom scrollbars directly within the design markup */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}