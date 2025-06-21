const express = require("express");
const auth = require("../middleware/auth-middleware");
const {
  submitContact,
  getContact,
  markAsRead,
  deleteContact,
  getContactStats,
} = require("../controllers/contact-controller");
const admin = require("../middleware/admin-middleware");

const contactRouter = express.Router();

// Submit contact form (public route)
contactRouter.post("/", submitContact);

// Get all contact messages (admin only)
contactRouter.get("/admin", auth, admin, getContact);

// Mark message as read (admin only)
contactRouter.put("/admin/:id/read", auth, admin, markAsRead);

// Delete contact message (admin only)
contactRouter.delete("/admin/:id", auth, admin, deleteContact);

// Get contact statistics (admin only)
contactRouter.get("/admin/stats", auth, admin, getContactStats);

module.exports = contactRouter;
