import { useEffect, useState, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  X, 
  Check, 
  Loader2, 
  FileText 
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // સેશન સિક્યોરિટી ટોકનમાંથી આઈડી મેળવવો
  const getCompanyId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.companyId || decoded.tenantId || null;
      } catch (e) {
        console.error("Token decode error:", e);
      }
    }
    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    return userObj.companyId || userObj.tenantId || null;
  };

  const companyId = getCompanyId();

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    start: "",
    end: "",
    color: "#4f46e5",
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/calendar");
      const rawEvents = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const formatted = rawEvents.map((item) => {
        const eventColor = item.color || "#4f46e5";
        return {
          id: item._id || item.id,
          title: item.title || "No Title",
          start: item.start,
          end: item.end || item.start,
          display: "block", 
          backgroundColor: eventColor,
          borderColor: eventColor,
          extendedProps: {
            location: item.location || "",
            description: item.description || "",
            color: eventColor,
          }
        };
      });
      setEvents(formatted);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDateSelect = (selectInfo) => {
    const startStr = selectInfo.startStr.includes("T") 
      ? selectInfo.startStr.slice(0, 16) 
      : `${selectInfo.startStr}T09:00`;
    const endStr = selectInfo.endStr.includes("T") 
      ? selectInfo.endStr.slice(0, 16) 
      : `${selectInfo.startStr}T10:00`;

    setForm({
      title: "",
      location: "",
      description: "",
      start: startStr,
      end: endStr,
      color: "#4f46e5",
    });
    setShowAddModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEventId(event.id);
    
    const formatToDatetimeLocal = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const pad = (num) => String(num).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setForm({
      title: event.title || "",
      location: event.extendedProps.location || "",
      description: event.extendedProps.description || "",
      start: formatToDatetimeLocal(event.start),
      end: formatToDatetimeLocal(event.end || event.start),
      color: event.extendedProps.color || event.backgroundColor || "#4f46e5",
    });
    setShowEditModal(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.start || !form.end) {
      alert("Please fill in Title, Start Date, and End Date.");
      return;
    }

    try {
      setActionLoading(true);
      await API.post("/calendar", {
        title: form.title,
        location: form.location,
        description: form.description,
        start: new Date(form.start).toISOString(),
        end: new Date(form.end).toISOString(),
        color: form.color,
        companyId: companyId,
      });

      setShowAddModal(false);
      fetchEvents();
      alert("Event added successfully.");
      notifier.calendarEventLogged(form.title);
    } catch (err) {
      console.error("Create event failed:", err);
      alert(err.response?.data?.message || "Failed to create event.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;

    try {
      setActionLoading(true);
      await API.put(`/calendar/${selectedEventId}`, {
        title: form.title,
        location: form.location,
        description: form.description,
        start: new Date(form.start).toISOString(),
        end: new Date(form.end).toISOString(),
        color: form.color,
        companyId: companyId,
      });

      setShowEditModal(false);
      fetchEvents();
      alert("Event updated successfully.");
    } catch (err) {
      console.error("Update event failed:", err);
      alert(err.response?.data?.message || "Failed to update event.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setActionLoading(true);
      await API.delete(`/calendar/${selectedEventId}`);
      setShowEditModal(false);
      fetchEvents();
      alert("Event deleted successfully.");
    } catch (err) {
      console.error("Delete event failed:", err);
      alert(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.extendedProps?.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 pt-0 mt-0">
      {/* 🔹 કૅલેન્ડરના ઘાટા આંકડા, વાઇટ-ગેપ રીસેટ અને પર્ફેક્ટ કલર સેટિંગ્સ */}
      <style>{`
        /* ઉપરની બાજુ આવતી વાઇટ જગ્યા અને માર્જિન શિફ્ટ રીસેટ */
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        main {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        .max-w-7xl {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        
        .fc .fc-daygrid-day-number {
          color: #0f172a !important; /* તારીખ ઘાટી કાળી */
          font-weight: 800 !important;
          font-size: 14px !important;
          text-decoration: none !important;
          padding: 8px !important;
        }
        .fc .fc-col-header-cell-cushion {
          color: #0f172a !important; /* વાર બ્લેક */
          font-weight: 800 !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.05em !important;
          text-decoration: none !important;
        }
        .fc .fc-toolbar-title {
          color: #0f172a !important; 
          font-weight: 900 !important;
          font-size: 1.6rem !important;
        }
        .fc .fc-theme-standard td, .fc .fc-theme-standard th {
          border-color: #cbd5e1 !important; /* સ્પષ્ટ ગ્રે ગ્રીડ બોર્ડર્સ */
        }
        .fc .fc-day-today {
          background-color: #f8fafc !important; 
        }
        .fc .fc-button-primary {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
          color: #ffffff !important;
          border-radius: 12px !important;
          font-weight: 700 !important;
        }
        .fc .fc-button-primary:hover {
          background-color: #4338ca !important;
          border-color: #4338ca !important;
        }
        
        /* 🔹 પૂરા લંબચોરસમાં સળંગ કલર સેટ કરવા માટેના રૂલ્સ */
        .fc-daygrid-event-harness {
          margin: 0 !important; /* આજુબાજુની વાઇટ સ્પેસ અને માર્જિન રીસેટ */
          padding: 0 !important;
        }
        .fc-daygrid-event {
          background-color: var(--event-color, #4f46e5) !important;
          border-color: var(--event-color, #4f46e5) !important;
          border-radius: 0px !important; /* ચોરસ બોર્ડર-ટુ-બોર્ડર ફિલ */
          padding: 8px 12px !important; /* વધુ પેડિંગ જેથી આખું ખાનું પર્ફેક્ટ ભરાઈ જાય */
          margin: 1px 0 !important; 
          box-shadow: none !important;
          display: block !important;
        }
        .fc-event-main {
          background-color: transparent !important;
        }
        .fc-daygrid-event .fc-event-title {
          color: #000000 !important; /* લખાણ ઘાટો બ્લેક */
          font-weight: 800 !important;
          font-size: 12.5px !important;
        }
        .fc-daygrid-event-dot {
          display: none !important;
        }
      `}</style>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Workspace Schedule</span>
            <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
              <CalendarDays /> General Calendar & Schedules
            </h1>
            <p className="text-indigo-100 text-sm mt-2">Manage events, board meetings, and deadlines in one central timeline.</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <button
          onClick={() => {
            const now = new Date();
            const formatNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T09:00`;
            const formatEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T10:00`;
            setForm({
              title: "",
              location: "",
              description: "",
              start: formatNow,
              end: formatEnd,
              color: "#4f46e5",
            });
            setShowAddModal(true);
          }}
          className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
        >
          <Plus size={16} /> Create Schedule Event
        </button>
      </div>

      {/* Calendar Area */}
      <div className="bg-white border rounded-[32px] p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Syncing active workspace events...</p>
          </div>
        ) : (
          <div className="gantt-container-custom">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              events={filteredEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth"
              }}
              height="auto"
              eventDidMount={(info) => {
                const color = info.event.extendedProps.color || info.event.backgroundColor || "#4f46e5";
                info.el.style.setProperty("--event-color", color);
              }}
            />
          </div>
        )}
      </div>

      {/* MODAL: ADD EVENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            {/* હેડર ઇન્ડિગો ગ્રેડિયન્ટ બાર */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays size={22} /> Add New Event
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white bg-white/10 p-1.5 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Sprint Planning Session"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.start}
                    onChange={(e) => setForm({ ...form, start: e.target.value })}
                    className="w-full h-11 border rounded-xl px-3 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    className="w-full h-11 border rounded-xl px-3 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location / Meet Link</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Conference Room A / Zoom Link"
                    className="w-full h-11 border rounded-xl pl-10 pr-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slate-400 h-4.5 w-4.5" />
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide meeting agenda details..."
                    className="w-full rounded-2xl border p-3 pl-10 text-sm bg-slate-50/50 outline-none resize-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Theme Category Color</label>
                <div className="flex gap-2">
                  {["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#a855f7"].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      style={{ backgroundColor: color }}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${form.color === color ? "border-slate-800 scale-110" : "border-transparent"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / EDIT / DELETE EVENT */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            {/* હેડર ઇન્ડિગો ગ્રેડિયન્ટ બાર */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock size={22} /> Modify Event Schedule
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white bg-white/10 p-1.5 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Event Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.start}
                    onChange={(e) => setForm({ ...form, start: e.target.value })}
                    className="w-full h-11 border rounded-xl px-3 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    className="w-full h-11 border rounded-xl px-3 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location / Meet Link</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full h-11 border rounded-xl pl-10 pr-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slate-400 h-4.5 w-4.5" />
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-2xl border p-3 pl-10 text-sm bg-slate-50/50 outline-none resize-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Theme Category Color</label>
                <div className="flex gap-2">
                  {["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#a855f7"].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      style={{ backgroundColor: color }}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${form.color === color ? "border-slate-800 scale-110" : "border-transparent"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  disabled={actionLoading}
                  className="h-11 px-4 border border-rose-200 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-rose-100 disabled:opacity-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}