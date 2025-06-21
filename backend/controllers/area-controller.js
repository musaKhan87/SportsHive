const Area = require("../models/Area");
const City = require("../models/City");

const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ name: 1 }).populate("city", "name");

    res.json(areas);
  } catch (error) {
    console.error("Get areas error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getsingleArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).populate("city", "name");

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.json(area);
  } catch (error) {
    console.error("Get area error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createArea = async (req, res) => {
  try {
    const { name, city } = req.body;

    // Check if category already exists
    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res.status(400).json({ message: "Area already exists" });
    }

    // Check if city is not exists
    const existingCity = await City.findById(city);
    if (!existingCity) {
      return res.status(400).json({ message: "City is not available" });
    }

    const area = new Area({ name, city });
    await area.save();

    res.status(201).json(area);
  } catch (error) {
    console.error("Create area error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateArea = async (req, res) => {
  try {
    const { name, city } = req.body;

    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { name, city },
      { new: true }
    );

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.json(area);
  } catch (error) {
    console.error("Update area error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);

    if (!area) {
      return res.status(404).json({ message: "area not found" });
    }

    res.json({ message: "area deleted successfully" });
  } catch (error) {
    console.error("Delete area error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllAreas, getsingleArea, createArea, updateArea, deleteArea };