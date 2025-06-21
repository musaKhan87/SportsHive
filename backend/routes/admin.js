const express = require("express");
const auth = require("../middleware/auth-middleware");
const admin = require("../middleware/admin-middleware");
const { getAllUsers, updateUsers, deleteUsers, getAllEvents, deleteEvents, getAdminDashboard } = require("../controllers/admin-controller");
const adminRouter = express.Router();

// Get all users (admin only)
adminRouter.get("/users", auth, admin, getAllUsers);

// Update user role (admin only)
adminRouter.put("/users/:id/role", auth, admin, updateUsers);

// Delete user (admin only)
adminRouter.delete("/users/:id", auth, admin, deleteUsers);

// Get all events (admin only)
adminRouter.get("/events", auth, admin, getAllEvents);

// Delete event (admin only)
adminRouter.delete("/events/:id", auth, admin, deleteEvents);

// Get admin dashboard stats
adminRouter.get("/stats", auth, admin, getAdminDashboard);

module.exports = adminRouter;