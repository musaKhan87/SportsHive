const express = require('express');
const { getAllCategories, getsingleCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categories-controller');
const admin = require('../middleware/admin-middleware');
const auth = require('../middleware/auth-middleware');
const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get("/", getAllCategories);

// Get single category
categoriesRouter.get("/:id", getsingleCategory);

// Create category (admin only)
categoriesRouter.post("/", auth, admin, createCategory);


// Update category (admin only)
categoriesRouter.put("/:id", auth, admin, updateCategory);


// Delete category (admin only)
categoriesRouter.delete("/:id", auth, admin, deleteCategory);


module.exports = categoriesRouter;