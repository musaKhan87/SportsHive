const express = require("express");
const {
  getEvents,
  getUserCreatedEvents,
  getUserJoinedEvents,
  getAllEvents,
  leaveEvent,
  joinEvent,
  deleteEvent,
  updateEvent,
  createEvent,
  getSingleEvent,
} = require("../controllers/event-controller");
const auth = require("../middleware/auth-middleware");
const upload = require("../middleware/uplaod");
const eventRouter = express.Router();

// IMPORTANT: Put specific routes BEFORE parameterized routes
// Get featured events for homepage - MUST come before /:id route
eventRouter.get("/featured", getEvents);

// Get user's created events
eventRouter.get("/user", auth, getUserCreatedEvents);

// Get events user has joined
eventRouter.get("/joined", auth, getUserJoinedEvents);

// Get all events with filtering and pagination
eventRouter.get("/", getAllEvents);

// Get single event - MUST come after specific routes
eventRouter.get("/:id", getSingleEvent);

// Create new event
eventRouter.post("/", auth, upload.single("image"), createEvent);

// Update event
eventRouter.put("/:id", auth, upload.single("image"), updateEvent);

// Delete event
eventRouter.delete("/:id", auth, deleteEvent);

// Join event
eventRouter.post("/:id/join", auth, joinEvent);

// Leave event
eventRouter.post("/:id/leave", auth, leaveEvent);

module.exports = eventRouter;
