import Event from "../models/Event.js";

// Create Calendar Event
export const createEvent = async (req, res) => {
  try {
    const { title, location, start, end } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({
        success: false,
        message: "Title, start date, and end date are required",
      });
    }

    const event = await Event.create({
      companyId: req.user.companyId,
      title,
      location: location || "",
      start: new Date(start),
      end: new Date(end),
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Calendar Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      companyId: req.user.companyId,
    }).sort({ start: 1 });

    res.json(events);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Calendar Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};