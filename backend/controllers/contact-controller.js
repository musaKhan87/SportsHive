const Contact = require("../models/Contact");

const submitContact=async (req,res) => {
    try {
      const { name, email, subject, message, type } = req.body;

      // Validation
      if (!name || !email || !subject || !message) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Create contact message
      const contact = new Contact({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        type: type || "general",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });

      await contact.save();

      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
}

const getContact = async (req, res) => {
    try {
      const { status, type, page = 1, limit = 50 } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (type) filter.type = type;

      const contacts = await Contact.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Contact.countDocuments(filter);

      res.json({
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

const markAsRead = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { status: "read" },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({ message: "Contact message not found" });
      }

     
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};

const deleteContact = async (req, res) => { 
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);

      if (!contact) {
        return res.status(404).json({ message: "Contact message not found" });
      }

      res.json({ message: "Contact message deleted successfully" });
    } catch (error) {
       res.status(500).json({ message: "Server error" });
    }
};

const getContactStats = async (req, res) => {
    try {
      const totalContacts = await Contact.countDocuments();
      const unreadContacts = await Contact.countDocuments({ status: "unread" });
      const contactsByType = await Contact.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]);

      const recentContacts = await Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email subject type createdAt status");

      res.json({
        totalContacts,
        unreadContacts,
        contactsByType,
        recentContacts,
      });
    } catch (error) {
     res.status(500).json({ message: "Server error" });
    }
};

module.exports = { submitContact, getContact, getContactStats, deleteContact, markAsRead };