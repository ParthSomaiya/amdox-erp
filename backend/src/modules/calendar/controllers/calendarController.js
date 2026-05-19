import Event from "../models/Event.js";

// ➕ Create Event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📅 Get Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      companyId: req.user.companyId,
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};