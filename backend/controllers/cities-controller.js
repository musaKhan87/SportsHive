const City = require("../models/City");

const getAllCities=async (req,res) => {
    try {
      const cities = await City.find().sort({ name: 1 });
      res.json(cities);
    } catch (error) {
      console.error("Get cities error:", error);
      res.status(500).json({ message: "Server error" });
    }
}

const getsingleCity=async (req,res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(city);
  } catch (error) {
    console.error("Get city error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const createCity = async (req, res) => {
  try {
    const { name, state } = req.body;

    // Check if city already exists
    const existingCity = await City.findOne({ name });
    if (existingCity) {
      return res.status(400).json({ message: "City already exists" });
    }

    const city = new City({ name, state });
    await city.save();

    res.status(201).json(city);
  } catch (error) {
    console.error("Create city error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateCity = async (req, res)=>{
  try {
    const { name, state } = req.body;

    const city = await City.findByIdAndUpdate(
      req.params.id,
      { name, state },
      { new: true }
    );

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(city);
  } catch (error) {
    console.error("Update city error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Delete city error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getsingleCity, getAllCities , updateCity,deleteCity,createCity };