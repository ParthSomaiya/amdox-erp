import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Loader2, ClipboardList } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import API from "../services/api";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  
  // 🔹 React 18 Compatibility માટે સ્ટેટ
  const [enabled, setEnabled] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const columns = ["TODO", "IN_PROGRESS", "DONE"];

  // 🔹 React 18 Lifecycle ફિક્સ (આનાથી ડ્રેગ-એન્ડ-ડ્રોપ ૧૦૦% એક્ટિવ થશે!)
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
      fetchTasks();
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
        return "bg-rose-50 text-rose-700 border border-rose-100";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      default:
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    }
  };

  if (loading || !enabled) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="mt-4 text-slate-600 font-semibold">Loading task boards...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Task Board</h1>
          <p className="mt-2 text-indigo-100 text-sm">Organize and drag-drop your workspace objectives.</p>
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center">
          <ClipboardList size={28} />
        </div>
      </div>

      {/* Task Creation Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Task</h2>
        <form onSubmit={createTask} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="h-11 rounded-xl border border-slate-300 px-4 bg-white outline-none focus:border-indigo-500 text-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <textarea
            rows="3"
            placeholder="Detailed description of the task..."
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-indigo-500 text-sm resize-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-1"
          >
            {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} />}
            {creating ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search task boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* DRAG DROP CONTEXT */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column);
            return (
              <Droppable droppableId={column} key={column}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-4 min-h-[400px]"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h3 className="font-bold text-slate-700 text-sm tracking-wide uppercase">
                        {column.replace("_", " ")}
                      </h3>
                      <span className="h-6 px-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center shadow-sm">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {columnTasks.map((task, index) => (
                        <Draggable draggableId={String(task._id)} index={index} key={task._id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 cursor-grab active:cursor-grabbing"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${priorityStyle(task.priority)}`}>
                                  {task.priority || "MEDIUM"}
                                </span>
                              </div>
                              {task.description && (
                                <p className="text-xs text-slate-500 leading-normal line-clamp-3">{task.description}</p>
                              )}
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