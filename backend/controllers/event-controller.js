const Event = require("../models/Event");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
      status: "active",
    })
      .populate("organizer", "name email avatar")
      .populate("participants", "name email avatar")
      .populate("sportCategory", "name")
      .sort({ date: 1 })
      .limit(6);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .populate("participants", "name email avatar")
      .populate("sportCategory", "name")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserJoinedEvents = async (req, res) => {
  try {
    const events = await Event.find({ participants: req.user.id })
      .populate("organizer", "name email avatar")
      .populate("participants", "name email avatar")
      .populate("sportCategory", "name")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sport,
      location,
      date,
      skillLevel,
      search,
      sortBy = "date",
      sortOrder = "asc",
    } = req.query;

    const query = {};

    // Build filter query
    if (sport) query.sportCategory = new RegExp(sport, "i");
    if (location) query.location = new RegExp(location, "i");
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (skillLevel) query.skillLevel = skillLevel;
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
      ];
    }

    // Only show future events by default
    if (!date) {
      query.date = { $gte: new Date() };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const events = await Event.find(query)
      .populate("organizer", "name email avatar")
      .populate("participants", "name email avatar")
      .populate("sportCategory", "name")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email avatar bio")
      .populate("participants", "name email avatar bio")
      .populate("sportCategory", "name")
      .populate("city", "name")
      .populate("area", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      sportCategory,
      city,
      area,
      date,
      time,
      location,
      maxParticipants,
      skillLevel,
      requirements,
      contactInfo,
    } = req.body;

    const eventData = {
      title,
      description,
      sportCategory,
      city,
      area,
      date: new Date(date),
      time,
      location,
      maxParticipants: maxParticipants || null,
      skillLevel,
      requirements,
      contactInfo,
      organizer: req.user.id,
      participants: [req.user.id],
    };

    if (req.file && req.file.path) {
      eventData.image = req.file.path;
    }

    const event = new Event(eventData);
    await event.save();

    await event.populate("organizer", "name email avatar");
    await event.populate("participants", "name email avatar");
    await event.populate("sportCategory", "name");
    await event.populate("city", "name");
    await event.populate("area", "name");



    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    const updateData = { ...req.body };

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("organizer", "name email avatar")
      .populate("participants", "name email avatar")
      .populate("sportCategory", "name")
      .populate("city", "name")
      .populate("area", "name");
    

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.organizer.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }
    
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "Already joined this event" });
    }

    if (
      event.maxParticipants &&
      event.participants.length >= event.maxParticipants
    ) {
      return res.status(400).json({ message: "Event is full" });
    }

    event.participants.push(req.user.id);
    await event.save();

    await event.populate("organizer", "name email avatar");
    await event.populate("participants", "name email avatar");
    await event.populate("sportCategory", "name");

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "Not joined this event" });
    }

    if (event.organizer.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "Organizer cannot leave their own event" });
    }

    event.participants = event.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );
    await event.save();

    await event.populate("organizer", "name email avatar");
    await event.populate("participants", "name email avatar");
    await event.populate("sportCategory", "name");

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  getEvents,
  getUserCreatedEvents,
  getUserJoinedEvents,
  getAllEvents,
  getSingleEvent,
  createEvent,
  updateEvent,
  leaveEvent,
  joinEvent,
  deleteEvent,
};
