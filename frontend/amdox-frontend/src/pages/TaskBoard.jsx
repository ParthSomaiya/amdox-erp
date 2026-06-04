import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Loader2, ClipboardList, GripVertical, CheckCircle2, Calendar, User, AlignLeft, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false); // Collapsible Form state
  
  // 🔹 React 18 Compatibility માટે સ્ટેટ
  const [enabled, setEnabled] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const columns = ["TODO", "IN_PROGRESS", "DONE"];

  // 🔹 React 18 Lifecycle ફિક્સ
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await API.post("/tasks", {
        ...newTask,
        status: "TODO",
      });
      setNewTask({ title: "", description: "", priority: "MEDIUM" });
      setShowForm(false);
      fetchTasks();
      notifier.taskCreated(newTask.title);
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      String(task._id) === String(draggableId) 
        ? { ...task, status: destination.droppableId } 
        : task
    );
    setTasks(updatedTasks);

    try {
      await API.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      notifier.taskUpdated(draggableId, destination.droppableId);
    } catch (err) {
      console.error("Failed to update task status:", err);
      fetchTasks(); 
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const priorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      case "MEDIUM":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
    }
  };

  if (loading || !enabled) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Aligning workspace objectives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      {/* 🚀 Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Agile Sprint Board</span>
            <h1 className="text-2xl sm:text-3xl font-black">🧩 Workspace Task Board</h1>
            <p className="text-slate-400 text-xs mt-1">Organize, track, and drag-drop your product release objectives.</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shrink-0 cursor-pointer self-start sm:self-center"
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? "Cancel" : "Create New Task"}
          </button>
        </div>
      </div>

      {/* 🚀 COLLAPSIBLE CREATION FORM (Elegant & Glassmorphic) */}
      {showForm && (
        <div className="bg-white rounded-3xl border p-6 shadow-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b">
            <ClipboardList className="text-indigo-600" size={18} />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">New Task Specifications</h2>
          </div>

          <form onSubmit={createTask} className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Integrate Plaid KYC API"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Priority Limit</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full h-11 border rounded-xl px-3 bg-slate-50/50 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="LOW">LOW PRIORITY</option>
                  <option value="MEDIUM">MEDIUM PRIORITY</option>
                  <option value="HIGH">HIGH PRIORITY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Task Description</label>
              <textarea
                rows="3"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Specify core engineering goals..."
                className="w-full rounded-2xl border p-4 outline-none resize-none focus:border-indigo-500 bg-slate-50/50 focus:bg-white font-medium"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 px-5 border rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Plus size={14} />}
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🚀 Search & Filter Area */}
      <div className="bg-white rounded-2xl border p-3 shadow-sm flex items-center gap-3">
        <Search size={16} className="text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Filter objectives by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow h-8 outline-none text-xs sm:text-sm bg-transparent text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* 🚀 KANBAN BOARD SYSTEM */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column);
            
            // ડાયનેમિક કલર ગ્રેડિયન્ટ બેનર્સ
            const columnColors = {
              TODO: "border-t-indigo-500/80 bg-indigo-500/5",
              IN_PROGRESS: "border-t-amber-500/80 bg-amber-500/5",
              DONE: "border-t-emerald-500/80 bg-emerald-500/5"
            };

            return (
              <Droppable droppableId={column} key={column}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`border-t-4 rounded-3xl p-5 space-y-4 min-h-[450px] border border-slate-200/80 ${columnColors[column] || "bg-slate-50/50"}`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <h3 className="font-extrabold text-slate-700 text-xs tracking-wider uppercase">
                        {column.replace("_", " ")}
                      </h3>
                      <span className="h-6 px-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center shadow-sm">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Draggable Cards Stack */}
                    <div className="space-y-3 min-h-[350px]">
                      {columnTasks.map((task, index) => (
                        <Draggable draggableId={String(task._id)} index={index} key={task._id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 space-y-3.5 cursor-grab active:cursor-grabbing relative group"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug group-hover:text-indigo-600 transition">
                                    {task.title}
                                  </h4>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase block">ID: #{task._id?.slice(-5) || "TASK"}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase shrink-0 ${priorityStyle(task.priority)}`}>
                                  {task.priority || "MEDIUM"}
                                </span>
                              </div>

                              {task.description && (
                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
                              )}

                              {/* Task Card Footer */}
                              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase">
                                <span className="flex items-center gap-1"><User size={11} className="text-slate-300" /> {task.assignedTo || "Unassigned"}</span>
                                <span className="flex items-center gap-0.5"><GripVertical size={11} className="text-slate-300" /></span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}