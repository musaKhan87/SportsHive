const express = require("express");
const statsRouter = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const Category = require("../models/Category");

// @route   GET /api/stats
// @desc    Get general platform statistics
// @access  Public
statsRouter.get("/", async (req, res) => {
  try {
    const [userCount, eventCount, categoryCount] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Category.countDocuments(),
    ]);

    res.json({
      users: userCount,
      events: eventCount,
      categories: categoryCount,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = statsRouter;
