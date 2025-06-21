const express = require("express");
const searchRouter = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const Category = require("../models/Category");

// @route   GET api/search/events
// @desc    Search events with filters
// @access  Public
searchRouter.get("/events", async (req, res) => {
  try {
    const {
      q, // search query
      sport,
      location,
      date,
      skillLevel,
      page = 1,
      limit = 12,
    } = req.query;

    // Build search query
    const searchQuery = {};

    // Text search
    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    // Sport filter
    if (sport) {
      const category = await Category.findOne({
        name: { $regex: sport, $options: "i" },
      });
      if (category) {
        searchQuery.sportCategory = category._id;
      }
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    // Date filter
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      searchQuery.date = {
        $gte: searchDate,
        $lt: nextDay,
      };
    }

    // Skill level filter
    if (skillLevel && skillLevel !== "all") {
      searchQuery.skillLevel = { $in: [skillLevel, "all"] };
    }

    // Only show future events
    searchQuery.date = {
      ...searchQuery.date,
      $gte: searchQuery.date?.$gte || new Date(),
    };

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    // Execute search
    const events = await Event.find(searchQuery)
      .populate("sportCategory", "name")
      .populate("creator", "name avatar")
      .populate("participants", "name avatar")
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number.parseInt(limit));

    // Get total count for pagination
    const totalEvents = await Event.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalEvents / Number.parseInt(limit));

  

    res.json({
      events,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalEvents,
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    });
  } catch (err) {
    logger.error(`Error searching events: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET api/search/users
// @desc    Search users/buddies
// @access  Private (requires authentication)
searchRouter.get("/users", async (req, res) => {
  try {
    const {
      q, // search query
      sport,
      location,
      page = 1,
      limit = 12,
    } = req.query;

    // Build search query
    const searchQuery = {};

    // Text search
    if (q) {
      searchQuery.$or = [
        { name: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    // Sport filter
    if (sport) {
      const category = await Category.findOne({
        name: { $regex: sport, $options: "i" },
      });
      if (category) {
        searchQuery.favoriteCategories = category._id;
      }
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    // Execute search
    const users = await User.find(searchQuery)
      .select("name avatar bio location favoriteCategories createdAt")
      .populate("favoriteCategories", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / Number.parseInt(limit));

  

    res.json({
      users,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET api/search/suggestions
// @desc    Get search suggestions
// @access  Public
searchRouter.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get event title suggestions
    const eventSuggestions = await Event.find({
      title: { $regex: q, $options: "i" },
    })
      .select("title")
      .limit(5);

    // Get category suggestions
    const categorySuggestions = await Category.find({
      name: { $regex: q, $options: "i" },
    })
      .select("name")
      .limit(5);

    // Get location suggestions from events
    const locationSuggestions = await Event.distinct("location", {
      location: { $regex: q, $options: "i" },
    }).limit(5);

    const suggestions = [
      ...eventSuggestions.map((event) => ({
        type: "event",
        text: event.title,
      })),
      ...categorySuggestions.map((category) => ({
        type: "sport",
        text: category.name,
      })),
      ...locationSuggestions.map((location) => ({
        type: "location",
        text: location,
      })),
    ].slice(0, 10);

    res.json({ suggestions });
  } catch (err) {
   res.status(500).json({ message: "Server error" });
  }
});

module.exports = searchRouter;
