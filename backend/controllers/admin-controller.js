const Event = require("../models/Event");
const User = require("../models/User");

const getAllUsers=async (req,res) => {
    try {
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
}

const updateUsers = async (req, res) => {
    try {
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

const deleteUsers = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't allow deleting other admins
      if (user.role === "admin" && user._id.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Cannot delete other admin users" });
      }

      // Delete user's events
      await Event.deleteMany({ organizer: req.params.id });

      // Remove user from all events they joined
      await Event.updateMany(
        { participants: req.params.id },
        { $pull: { participants: req.params.id } }
      );

      await User.findByIdAndDelete(req.params.id);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

const getAllEvents = async (req, res) => {

    try {
      const events = await Event.find({})
        .populate("organizer", "name email")
        .populate("participants", "name email")
        .sort({ createdAt: -1 });

      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
 };

const deleteEvents = async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

  
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
     res.status(500).json({ message: "Server error" });
    }
};

const getAdminDashboard = async (req, res) => {
    try {
      const Contact = require("../models/Contact");

      const totalUsers = await User.countDocuments();
      const totalEvents = await Event.countDocuments();
      const activeEvents = await Event.countDocuments({
        date: { $gte: new Date() },
      });
      const totalContacts = await Contact.countDocuments();
      const totalParticipations = await Event.aggregate([
        { $group: { _id: null, total: { $sum: { $size: "$participants" } } } },
      ]);

      const recentUsers = await User.find({})
        .select("name email createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

      const recentEvents = await Event.find({})
        .populate("organizer", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        stats: {
          totalUsers,
          totalEvents,
          activeEvents,
          totalContacts,
          totalParticipations: totalParticipations[0]?.total || 0,
        },
        recentUsers,
        recentEvents,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};


module.exports = { getAllUsers, updateUsers, deleteUsers, getAdminDashboard, getAllEvents, deleteEvents };
