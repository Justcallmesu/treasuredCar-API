// Core Modules
const path = require('path');

// Auth
const { registerSeller, loginSeller } = require(path.join(__dirname, "../auth/sellers.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Router
const router = require("express").Router();

router.route("/register").post(asyncHandler(isLoggedIn), asyncHandler(registerSeller));
router.route("/login").post(asyncHandler(isLoggedIn), asyncHandler(loginSeller));


module.exports = router;