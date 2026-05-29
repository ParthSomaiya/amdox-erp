import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { buildGanttData } from "../services/ganttService.js";

// =========================
// CREATE PROJECT
// =========================
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      companyId: req.user.companyId,
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// GET PROJECTS (Merged with Auto-Seeding!)
// =========================
export const getProjects = async (req, res) => {
  try {
    let projects = await Project.find({ companyId: req.user.companyId }).populate("members");

    // જો કોઈ પ્રોજેક્ટ ન હોય તો ડાયનેમિક બજેટ વેરિઅન્સ ટેસ્ટિંગ સાથે સીડ કરો
    if (projects.length === 0) {
      projects = await Project.create([
        {
          name: "AMDOX Cloud ERP",
          description: "Consolidate accounting, payroll and HR modules into a SaaS portal",
          budget: 150000,
          spent: 120000,
          companyId: req.user.companyId
        },
        {
          name: "AI Demand Forecasting",
          description: "Develop ML predictive analytics using Prophet/LSTM models",
          budget: 85000,
          spent: 35000,
          companyId: req.user.companyId
        },
        {
          name: "Warehouse IoT Integration",
          description: "Integrate biometric and barcode scanners in the warehouses",
          budget: 50000,
          spent: 56000, // Trigger budget overrun alert
          companyId: req.user.companyId
        }
      ]);
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// CREATE TASK
// =========================
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      companyId: req.user.companyId
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET TASKS
// =========================
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
    }).populate("assignedTo");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// UPDATE TASK STATUS
// =========================
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// PROJECT ANALYTICS
// =========================
export const projectAnalytics = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({ companyId: req.user.companyId });
    const totalTasks = await Task.countDocuments({ companyId: req.user.companyId });
    const completedTasks = await Task.countDocuments({ companyId: req.user.companyId, status: "DONE" });
    const pendingTasks = await Task.countDocuments({ companyId: req.user.companyId, status: "TODO" });

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET PROJECT DETAILS
// =========================
export const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const tasks = await Task.find({ projectId: id });
    const completed = tasks.filter(t => t.status === "DONE").length;

    res.json({
      project,
      totalTasks: tasks.length,
      completedTasks: completed,
      progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GANTT TASKS
// =========================

export const getGanttTasks = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    let data;

    // જો પ્રોજેક્ટ આઈડી હોય અને વેલિડ હોય, તો જ ગેન્ટ ડેટા બિલ્ડ કરો
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      data = await buildGanttData(projectId);
    } else {
      // 🔹 સેફ ફોલબેક: જો આઈડી મિસિંગ હોય તો કંપનીની લાઈવ ટાસ્ક્સને ઓટોમેટિક ગેન્ટ ફોર્મેટમાં બતાવશે (Fixed 500 Error!)
      const tasks = await Task.find({ companyId: req.user?.companyId || null });
      data = tasks.map((t) => {
        const sDate = t.startDate ? new Date(t.startDate) : new Date(t.createdAt || Date.now());
        const eDate = t.endDate ? new Date(t.endDate) : new Date(sDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        return {
          id: String(t._id),
          name: t.title || "Task",
          start: sDate,
          end: eDate,
          type: "task",
          progress: t.status === "DONE" ? 100 : t.status === "IN_PROGRESS" ? 50 : 0,
          styles: { progressColor: "#4f46e5", progressSelectedColor: "#312e81" }
        };
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Gantt fetch error:", err);
    res.status(500).json({ message: "Failed to load Gantt: " + err.message });
  }
};