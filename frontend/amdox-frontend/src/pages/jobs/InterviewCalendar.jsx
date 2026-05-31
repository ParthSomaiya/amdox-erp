import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Calendar, Loader2, RefreshCw, Trash2, Video } from "lucide-react";
import API from "../../services/api";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function InterviewCalendar() {
  const [rawInterviews, setRawInterviews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs/interviews").catch(() => {
        const localData = JSON.parse(localStorage.getItem("amdox_scheduled_interviews") || "[]");
        return { data: localData };
      });

      const list = res.data || [];
      setRawInterviews(list);

      // Map to Calendar format with safe date parsing
      const formatted = list.map(item => {
        const startDateTime = new Date(`${item.date}T${item.time || "10:00"}`);
        return {
          id: item._id,
          title: `${item.candidateName} - ${item.type} (${item.position})`,
          start: isNaN(startDateTime.getTime()) ? new Date() : startDateTime,
          end: isNaN(startDateTime.getTime()) ? new Date() : new Date(startDateTime.getTime() + 60*60*1000),
        };
      });
      setEvents(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInterview = (id) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled interview?")) return;
    
    const updated = rawInterviews.filter(item => item._id !== id);
    localStorage.setItem("amdox_scheduled_interviews", JSON.stringify(updated));
    fetchInterviews();

    window.triggerAmdoxNotification?.(
      "Interview Cancelled", 
      "The scheduled slot has been cancelled and deleted.", 
      "GENERAL"
    );
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      <style>{`
        .rbc-calendar { font-family: 'Inter', sans-serif !important; }
        .rbc-event { background-color: #4f46e5 !important; border-radius: 6px !important; font-size: 10px !important; font-weight: bold !important; padding: 2px 6px !important; }
        .rbc-today { background-color: #f8fafc !important; }
        .rbc-header { font-weight: bold !important; color: #475569 !important; padding: 6px !important; font-size: 11px !important; }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">HR Recruiter Workspace</span>
          <h1 className="text-xl sm:text-2xl font-black mt-1 flex items-center gap-2"><Calendar size={22} className="shrink-0" /> Interview Calendar Board</h1>
          <p className="text-slate-400 text-xs max-w-xl">Monitor candidate interview schedules, panel times, and video conference logs.</p>
        </div>
        <button onClick={fetchInterviews} className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition z-10 self-start sm:self-center cursor-pointer shrink-0">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
          
          {/* Calendar View Container */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-[32px] border p-4 sm:p-6 shadow-sm min-h-[420px] sm:min-h-[500px] w-full overflow-hidden">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[480px] sm:min-w-0">
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 420 }}
                />
              </div>
            </div>
          </div>

          {/* Cancel/Join Interactive Side Panel */}
          <div className="lg:col-span-4 bg-white border rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base border-b pb-2.5">Active Scheduled Slots</h3>
            
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {rawInterviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">No interviews scheduled yet.</p>
              ) : (
                rawInterviews.map((item) => (
                  <div key={item._id} className="p-3.5 bg-slate-50 border rounded-xl space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate">{item.candidateName}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold truncate">{item.position} • {item.type}</p>
                      </div>
                      <button 
                        onClick={() => handleCancelInterview(item._id)}
                        className="text-rose-500 hover:text-rose-700 transition shrink-0 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 text-[9px] text-slate-400 font-bold uppercase">
                      <span>{item.date} @ {item.time}</span>
                      <a href={item.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 shrink-0">
                        <Video size={11} /> Join Meet
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}