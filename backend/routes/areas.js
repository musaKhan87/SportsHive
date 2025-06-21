const express = require('express');
const { getAllAreas, getsingleArea, createArea, updateArea, deleteArea } = require('../controllers/area-controller');
const admin = require('../middleware/admin-middleware');
const auth = require('../middleware/auth-middleware');
const areaRouter = express.Router();

// Get all areas
areaRouter.get("/", getAllAreas);

// Get single area
areaRouter.get("/:id", getsingleArea);


// Create area (admin only)
areaRouter.post("/", auth, admin, createArea);


// Update Area (admin only)
areaRouter.put("/:id", auth, admin, updateArea);


// Delete Area (admin only)
areaRouter.delete("/:id", auth, admin, deleteArea);


module.exports = areaRouter;