const User = require("../models/User");

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate(
        "favoriteCategories",
        "name"
      );
      res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, favoriteCategories } = req.body;

    const updatedData = {
      name,
      bio,
      location,
      favoriteCategories: JSON.parse(favoriteCategories || "[]"),
    };

    if (req.file && req.file.path) {
      updatedData.avatar = req.file.path; // this is the Cloudinary secure URL
    }

    // update user in DB (example):
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Profile update failed." });
  }
};

const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("favoriteCategories", "name");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getProfile, updateProfile, getUser };