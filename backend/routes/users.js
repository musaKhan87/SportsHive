const express = require('express');
const auth = require('../middleware/auth-middleware');
// const multer = require('multer');
// const path = require("path");
const { getProfile,updateProfile,getUser } = require('../controllers/users-controller');
const upload = require('../middleware/uplaod');


const userRouter = express.Router();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/avatars/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
//     },
// })

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only image files (JPEG, JPG, PNG) are allowed"));
//     }
//   },
// });
  

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
userRouter.get("/profile", auth, getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
userRouter.put("/profile", auth, upload.single("avatar"), updateProfile);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
userRouter.get("/:id", getUser);

module.exports = userRouter;
