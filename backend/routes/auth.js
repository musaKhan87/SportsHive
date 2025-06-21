const express = require("express");
const { GetCurrentUser, Login, Register } = require("../controllers/auth-controller");
const auth = require("../middleware/auth-middleware");

const authRouter = express.Router();

authRouter.post("/register", Register);

authRouter.post("/login", Login);

authRouter.get("/me",auth, GetCurrentUser);

module.exports = authRouter;