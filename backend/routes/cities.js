const express = require('express');
const { getAllCities, getsingleCity, createCity, updateCity, deleteCity } = require('../controllers/cities-controller');
const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');
const citiesRouter= express.Router();

// Get all cities
citiesRouter.get("/", getAllCities);

// Get single city
citiesRouter.get("/:id", getsingleCity);

// Create city (admin only)
citiesRouter.post("/", auth, admin, createCity);


// Update city (admin only)
citiesRouter.put("/:id", auth, admin, updateCity);


// Delete city (admin only)
citiesRouter.delete("/:id", auth, admin, deleteCity);



module.exports = citiesRouter ;