const express = require("express");
const auth = require("../middleware/auth-middleware");
const Event = require("../models/Event");
const User = require("../models/User");
const dashboardRouter = express.Router();



// @route   GET /api/dashboard
// @desc    Get dashboard data for authenticated user
// @access  Private
dashboardRouter.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get upcoming events user has joined
    const upcomingEvents = await Event.find({
      participants: userId,
      date: { $gte: new Date() },
    })
      .populate("sportCategory", "name")
      .populate("creator", "name email")
      .sort({ date: 1 })
      .limit(6);

    // Get user's created events
    const myEvents = await Event.find({
      creator: userId,
    })
      .populate("sportCategory", "name")
      .sort({ createdAt: -1 })
      .limit(4);

    // Calculate user stats
    const eventsJoined = await Event.countDocuments({
      participants: userId,
    });

    const eventsCreated = await Event.countDocuments({
      creator: userId,
    });

    const buddiesConnected = await Event.aggregate([
      { $match: { participants: userId } },
      { $unwind: "$participants" },
      { $match: { participants: { $ne: userId } } },
      { $group: { _id: "$participants" } },
      { $count: "total" },
    ]);

    // Get event recommendations based on user's interests
    const user = await User.findById(userId).populate("favoriteCategories");
    const categoryIds = user.favoriteCategories?.map((cat) => cat._id) || [];

    const recommendations = await Event.find({
      sportCategory: { $in: categoryIds },
      participants: { $ne: userId },
      creator: { $ne: userId },
      date: { $gte: new Date() },
    })
      .populate("sportCategory", "name")
      .populate("creator", "name email")
      .sort({ createdAt: -1 })
      .limit(4);

    // Generate recent activity
    const recentActivity = [
      {
        description: "Joined Basketball Pickup Game",
        time: "2 hours ago",
      },
      {
        description: "Created Tennis Tournament",
        time: "1 day ago",
      },
      {
        description: "Connected with 3 new sports buddies",
        time: "3 days ago",
      },
    ];

    const stats = {
      eventsJoined,
      eventsCreated,
      buddiesConnected: buddiesConnected[0]?.total || 0,
      totalHours: Math.floor(Math.random() * 50) + 10, // Mock data
    };

    res.json({
      upcomingEvents,
      myEvents,
      stats,
      recommendations,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = dashboardRouter;
